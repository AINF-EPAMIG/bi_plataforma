import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { getConnection } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// Exporta projetos do banco para um arquivo Excel (.xlsx)
export async function GET() {
  try {
    const conn = await getConnection();

    // Ajuste os campos conforme a sua tabela `projetos`
    interface ProjetoExportRow extends RowDataPacket {
      id: number;
      codigo_programa: number;
      responsavel?: string | null;
      codigo_situacao: number;
      valor_aprovado: string | number | null;
      final: string | Date | null;
    }

    const [rows] = await conn.query<ProjetoExportRow[]>(
       `SELECT 
        id,
        codigo_programa,
        responsavel,
        codigo_situacao,
        valor_aprovado,
        final
      FROM projetos
      ORDER BY id DESC
      LIMIT 10000`
    );

    // Cria o workbook e a planilha
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Projetos');

    // Cabeçalhos das colunas
    type ExcelRow = {
      id: number;
      codigo_programa: number;
      responsavel: string;
      codigo_situacao: number;
      valor_aprovado: number;
      final: Date | null;
    };

    const columns: Array<Partial<ExcelJS.Column>> = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Programa', key: 'codigo_programa', width: 14 },
      { header: 'Responsável', key: 'responsavel', width: 28 },
      { header: 'Situação', key: 'codigo_situacao', width: 12 },
      { header: 'Valor Aprovado', key: 'valor_aprovado', width: 18 },
      { header: 'Final', key: 'final', width: 14 },
    ];
    worksheet.columns = columns;

    // Estiliza o cabeçalho
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' } as ExcelJS.Alignment;
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      } as ExcelJS.Borders;
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFECECEC' },
      } as ExcelJS.Fill;
    });

    // Normaliza valor_aprovado que pode vir como string monetária ("R$ 1.234,56")
    const parseValor = (v: unknown) => {
      if (typeof v === 'number') return v;
      if (typeof v !== 'string') return 0;
      const cleaned = v
        .replace(/R\$\s?/g, '')
        .replace(/\./g, '')
        .replace(/\s/g, '')
        .replace(',', '.');
      const n = Number(cleaned);
      return Number.isFinite(n) ? n : 0;
    };

    // Adiciona linhas
    rows.forEach((r) => {
      const rowData: ExcelRow = {
        id: r.id,
        codigo_programa: r.codigo_programa,
        responsavel: r.responsavel ?? '',
        codigo_situacao: r.codigo_situacao,
        valor_aprovado: parseValor(r.valor_aprovado),
        final: r.final ? new Date(r.final) : null,
      };
      worksheet.addRow(rowData);
    });

    // Formatação de colunas
  const valorCol = worksheet.getColumn('valor_aprovado');
  (valorCol as ExcelJS.Column).numFmt = '#,##0.00';

  const dateFmt = 'dd/mm/yyyy';
  (worksheet.getColumn('final') as ExcelJS.Column).numFmt = dateFmt;

    // Auto filter
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: worksheet.rowCount, column: columns.length },
    } as ExcelJS.AutoFilter;

    // Gera o buffer do arquivo
    const buffer = await workbook.xlsx.writeBuffer();

    const fileName = `projetos_${new Date().toISOString().slice(0, 10)}.xlsx`;

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Erro ao exportar projetos para Excel:', error);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// Exporta dados agregados (CSV) conforme filtros enviados pelo dashboard via POST
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      tipo: 'quantitativo' | 'financeiro';
      formato?: 'csv' | 'xlsx';
      programas?: string[];
      anos?: string[];
      anoSelecionado?: number;
    };

  const tipo = body?.tipo ?? 'financeiro';
  const formato = body?.formato ?? 'csv';
    const programasIds = (body?.programas ?? []).map((p) => Number(p)).filter((n) => Number.isFinite(n));
    const anosNumeros = (body?.anos ?? []).map((a) => Number(a)).filter((n) => Number.isFinite(n));

    const conn = await getConnection();

    // Monta filtros dinâmicos
    const whereParts: string[] = [
      'codigo_situacao = 4',
      "responsavel IS NOT NULL",
      "responsavel != ''",
    ];
    const params: Array<number | string> = [];

    if (programasIds.length > 0) {
      whereParts.push(`codigo_programa IN (${programasIds.map(() => '?').join(',')})`);
      params.push(...programasIds);
    }
    if (anosNumeros.length > 0) {
      whereParts.push(`YEAR(final) IN (${anosNumeros.map(() => '?').join(',')})`);
      params.push(...anosNumeros);
    }

    const whereSql = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : '';

    interface AggRow extends RowDataPacket {
      codigo_programa: number;
      programa_nome: string;
      ano: number;
      valor_total: number | string | null;
      total_projetos: number | string | null;
    }

    const sql = `
      SELECT 
        proj.codigo_programa AS codigo_programa,
        prog.nome AS programa_nome,
        YEAR(proj.final) AS ano,
        COALESCE(SUM(
          CAST(REPLACE(REPLACE(REPLACE(REPLACE(COALESCE(proj.valor_aprovado, '0'), '.', ''), ',', '.'), ' ', ''), 'R$', '') AS DECIMAL(15,2))
        ), 0) AS valor_total,
        COUNT(*) AS total_projetos
      FROM projetos AS proj
      INNER JOIN programa AS prog ON prog.id = proj.codigo_programa
      ${whereSql.replaceAll('codigo_', 'proj.codigo_').replaceAll('YEAR(final)', 'YEAR(proj.final)').replace("responsavel ", "proj.responsavel ")}
      GROUP BY proj.codigo_programa, prog.nome, YEAR(proj.final)
      ORDER BY proj.codigo_programa, ano
    `;

  const [rows] = await conn.query<AggRow[]>(sql, params);

    // Se for XLSX, gerar planilha com larguras específicas
    if (formato === 'xlsx') {
      const workbook = new ExcelJS.Workbook();
      const ws = workbook.addWorksheet(
        tipo === 'quantitativo' ? 'Quantitativo' : 'Financeiro'
      );

      // Helpers e estruturas
      const pxToChars = (px: number) => Math.ceil(px / 7); // aproximação p/ ExcelJS
      const toNum = (v: unknown) => (typeof v === 'number' ? v : Number(v) || 0);
      const years = (anosNumeros.length > 0
        ? [...new Set(anosNumeros)]
        : [...new Set(rows.map((r) => r.ano))]
      ).sort((a, b) => a - b);

      type Agg = {
        nome: string;
        byYear: Record<number, { valor: number; qtd: number }>;
      };
      const agg = new Map<number, Agg>();
      for (const r of rows) {
        const entry = agg.get(r.codigo_programa) ?? {
          nome: r.programa_nome,
          byYear: {},
        };
        const y = r.ano;
        const current = entry.byYear[y] ?? { valor: 0, qtd: 0 };
        current.valor += toNum(r.valor_total);
        current.qtd += Math.trunc(toNum(r.total_projetos));
        entry.byYear[y] = current;
        agg.set(r.codigo_programa, entry);
      }

      // Monta cabeçalho dinâmico conforme o tipo
      const headerBase = ['Programa'];
      const headerYears = years.map((y) => String(y));
      const headerEnd = [
        tipo === 'quantitativo' ? 'Total de Projetos' : 'Total (Aprovado R$)'
      ];
      const header = [...headerBase, ...headerYears, ...headerEnd];

      ws.addRow(header);
      ws.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'center' } as ExcelJS.Alignment;
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECECEC' } } as ExcelJS.Fill;
      });

      // Larguras solicitadas
      // Programa: 365px, Ano: 64px (quantitativo) | 105px (financeiro), Total: 110px (quant) | 105px (financ)
      const firstColWidth = pxToChars(365);
      const yearColWidth = pxToChars(tipo === 'quantitativo' ? 64 : 105);
      const lastColWidth = pxToChars(tipo === 'quantitativo' ? 110 : 105);
      ws.getColumn(1).width = firstColWidth;
      for (let i = 0; i < years.length; i++) {
        ws.getColumn(2 + i).width = yearColWidth;
      }
      ws.getColumn(2 + years.length).width = lastColWidth;

      // Escreve linhas
      const brlFmt = '#,##0.00';
      const intFmt = '#,##0';
      for (const [, info] of agg) {
        const linha: Array<string | number> = [];
        linha.push(info.nome);

        let total = 0;
        for (const y of years) {
          const entry = info.byYear[y];
          if (tipo === 'quantitativo') {
            const qtd = entry ? entry.qtd : 0;
            linha.push(qtd);
            total += qtd;
          } else {
            const val = entry ? entry.valor : 0;
            linha.push(val);
            total += val;
          }
        }
        linha.push(total);
        ws.addRow(linha);
      }

      // Formatação numérica por coluna
      if (tipo === 'quantitativo') {
        // Colunas dos anos e total como inteiro
        for (let i = 0; i < years.length + 1; i++) {
          (ws.getColumn(2 + i) as ExcelJS.Column).numFmt = intFmt;
        }
      } else {
        // Colunas dos anos e total como moeda (2 casas)
        for (let i = 0; i < years.length + 1; i++) {
          (ws.getColumn(2 + i) as ExcelJS.Column).numFmt = brlFmt;
        }
      }

      ws.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: ws.rowCount, column: 1 + years.length + 1 },
      } as ExcelJS.AutoFilter;

      const buffer = await workbook.xlsx.writeBuffer();
      const dataAtual = new Date().toISOString().slice(0, 10);
      const nomeBase =
        tipo === 'quantitativo' ? 'projetos-quantitativo' : 'projetos-financeiro';
      const fileName = `${nomeBase}-${dataAtual}.xlsx`;

      return new NextResponse(buffer as unknown as BodyInit, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Cache-Control': 'no-store',
        },
      });
    }

    // Gera CSV
    const delim = ';'; // Excel (pt-BR) espera ; como separador
    const headers = ['Programa', 'Ano', 'Valor Total (R$)', 'Total de Projetos'];
    const lines = [headers.join(delim)];
    const toNum = (v: unknown) => {
      if (typeof v === 'number') return v;
      if (v == null) return 0;
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    };
    const formatBRL = (n: number) => new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
    const csvEscape = (value: string) => {
      // Se conter delimitador, aspas ou quebra de linha, envolver em aspas e escapar aspas
      if (value.includes(delim) || value.includes('"') || /[\r\n]/.test(value)) {
        return '"' + value.replaceAll('"', '""') + '"';
      }
      return value;
    };
    for (const r of rows) {
      const line = [
        csvEscape(r.programa_nome),
        String(r.ano),
        csvEscape(formatBRL(toNum(r.valor_total))),
        String(Math.trunc(toNum(r.total_projetos))),
      ].join(delim);
      lines.push(line);
    }
    // BOM para Excel reconhecer UTF-8 corretamente
    const csv = '\uFEFF' + lines.join('\n');

    const dataAtual = new Date().toISOString().slice(0, 10);
  const nomeBase = tipo === 'quantitativo' ? 'projetos-quantitativo' : 'projetos-financeiro';
    const fileName = `${nomeBase}-${dataAtual}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Erro ao exportar CSV de projetos:', error);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 });
  }
}
