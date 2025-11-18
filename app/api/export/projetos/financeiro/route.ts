import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import ExcelJS from 'exceljs';

interface ProgramaRow extends RowDataPacket {
  id: number;
  nome: string;
}

interface ValorRow extends RowDataPacket {
  TotalDaSoma: number | null;
}

interface CountRow extends RowDataPacket {
  total: number;
}

export async function GET() {
  try {
    const conn = await getConnection();
    
    // Buscar programas (excluindo IDs específicos)
    const [programas] = await conn.query<ProgramaRow[]>(`
      SELECT * FROM programa 
      WHERE id NOT IN (5, 8, 17, 18, 19, 6, 4, 15, 12, 2) 
      ORDER BY nome
    `);

    // Criar workbook do Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Projetos Financeiro');

    // Definir colunas
    worksheet.columns = [
      { header: 'Programa', key: 'programa', width: 40 },
      { header: 'Quantitativo', key: 'quantitativo', width: 15 },
      { header: 'Valor Aprovado', key: 'valorAprovado', width: 20 },
      { header: 'Quantitativo - Coord EPAMIG', key: 'quantitativoEpamig', width: 30 },
      { header: 'Valor Aprovado - Coord EPAMIG', key: 'valorAprovadoEpamig', width: 30 },
    ];

    // Estilizar cabeçalho
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF3A8144' }
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    let totalGeralQuantitativo = 0;
    let totalGeralValor = 0;
    let totalGeralQuantitativoEpamig = 0;
    let totalGeralValorEpamig = 0;

    // Para cada programa, buscar dados e adicionar na planilha
    for (const programa of programas) {
      // Quantitativo TOTAL
      const [countTotalResult] = await conn.query<CountRow[]>(`
        SELECT COUNT(*) as total 
        FROM projetos 
        WHERE codigo_programa = ? 
          AND codigo_situacao = '4'
      `, [programa.id]);

      const quantitativo = countTotalResult[0]?.total || 0;

      // Quantitativo EPAMIG
      const [countEpamigResult] = await conn.query<CountRow[]>(`
        SELECT COUNT(*) as total 
        FROM projetos 
        WHERE codigo_programa = ? 
          AND codigo_situacao = '4' 
          AND responsavel IS NOT NULL 
          AND responsavel != ''
      `, [programa.id]);

      const quantitativoEpamig = countEpamigResult[0]?.total || 0;

      // Valor TOTAL
      const [valorTotalResult] = await conn.query<ValorRow[]>(`
        SELECT SUM(
          CAST(
            REPLACE(
              REPLACE(
                REPLACE(
                  REPLACE(
                    REPLACE(valor_aprovado, '.', ''), 
                    ',', '.'
                  ), 
                  ' ', ''
                ), 
                'R$', ''
              ),
              'R', ''
            ) AS DECIMAL(15,2)
          )
        ) AS TotalDaSoma
        FROM projetos 
        WHERE codigo_programa = ? 
          AND codigo_situacao = '4'
          AND valor_aprovado IS NOT NULL
          AND valor_aprovado != ''
          AND valor_aprovado != '0'
          AND valor_aprovado != '0,00'
      `, [programa.id]);

      const valorAprovado = Number(valorTotalResult[0]?.TotalDaSoma) || 0;

      // Valor EPAMIG
      const [valorEpamigResult] = await conn.query<ValorRow[]>(`
        SELECT SUM(
          CAST(
            REPLACE(
              REPLACE(
                REPLACE(
                  REPLACE(
                    REPLACE(valor_aprovado, '.', ''), 
                    ',', '.'
                  ), 
                  ' ', ''
                ), 
                'R$', ''
              ),
              'R', ''
            ) AS DECIMAL(15,2)
          )
        ) AS TotalDaSoma
        FROM projetos 
        WHERE codigo_programa = ? 
          AND codigo_situacao = '4' 
          AND responsavel IS NOT NULL 
          AND responsavel != ''
          AND valor_aprovado IS NOT NULL
          AND valor_aprovado != ''
          AND valor_aprovado != '0'
          AND valor_aprovado != '0,00'
      `, [programa.id]);

      const valorAprovadoEpamig = Number(valorEpamigResult[0]?.TotalDaSoma) || 0;

      // Adicionar linha na planilha
      worksheet.addRow({
        programa: programa.nome,
        quantitativo: quantitativo,
        valorAprovado: valorAprovado,
        quantitativoEpamig: quantitativoEpamig,
        valorAprovadoEpamig: valorAprovadoEpamig,
      });

      totalGeralQuantitativo += quantitativo;
      totalGeralValor += valorAprovado;
      totalGeralQuantitativoEpamig += quantitativoEpamig;
      totalGeralValorEpamig += valorAprovadoEpamig;
    }

    // Adicionar linha de totais
    const totalRow = worksheet.addRow({
      programa: 'TOTAL',
      quantitativo: totalGeralQuantitativo,
      valorAprovado: totalGeralValor,
      quantitativoEpamig: totalGeralQuantitativoEpamig,
      valorAprovadoEpamig: totalGeralValorEpamig,
    });

    // Estilizar linha de totais
    totalRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    totalRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF3A8144' }
    };

    // Formatar células de valor como moeda
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const valorCell = row.getCell('valorAprovado');
        const valorEpamigCell = row.getCell('valorAprovadoEpamig');
        
        valorCell.numFmt = 'R$ #,##0.00';
        valorEpamigCell.numFmt = 'R$ #,##0.00';
      }
    });

    // Gerar buffer do Excel
    const buffer = await workbook.xlsx.writeBuffer();

    // Retornar como arquivo Excel
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="projetos_financeiro_${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    });

  } catch (error) {
    console.error('Erro ao gerar Excel:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao gerar arquivo Excel' },
      { status: 500 }
    );
  }
}
