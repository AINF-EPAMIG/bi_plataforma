import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface ProgramaRow extends RowDataPacket {
  id: number;
  nome: string;
}

interface ProjetoRow extends RowDataPacket {
  valor_total: number;
  total_projetos: number;
  ano: number;
}

interface ProgramaData {
  id: number;
  nome: string;
  valores_por_ano: { [ano: string]: number };
  projetos_por_ano: { [ano: string]: number };
  valor_total: number;
  total_projetos: number;
}

export async function GET() {
  try {
    const conn = await getConnection();
    
    // Gerar anos dinamicamente (ano atual + 4 anos)
    const anoAtual = new Date().getFullYear();
    const anos = Array.from({ length: 5 }, (_, i) => anoAtual + i);
    
    // Buscar programas (excluindo os IDs especificados no código PHP)
    const [programasRows] = await conn.query<ProgramaRow[]>(`
      SELECT id, nome 
      FROM programa 
      WHERE id NOT IN (5, 8, 17, 18, 19, 6, 4, 15, 12, 2) 
      ORDER BY nome
    `);

    const programas: ProgramaData[] = [];
    const totaisGerais = {
      valores_por_ano: {} as { [ano: string]: number },
      projetos_por_ano: {} as { [ano: string]: number },
      valor_total_geral: 0,
      total_projetos_geral: 0,
      // NOVO: Totais específicos do ano vigente
      valor_ano_vigente: 0,
      projetos_ano_vigente: 0
    };

    // Inicializar totais por ano
    anos.forEach(ano => {
      totaisGerais.valores_por_ano[ano] = 0;
      totaisGerais.projetos_por_ano[ano] = 0;
    });

    // Para cada programa, calcular valores e quantitativos por ano
    for (const programa of programasRows) {
      const programaData: ProgramaData = {
        id: programa.id,
        nome: programa.nome,
        valores_por_ano: {},
        projetos_por_ano: {},
        valor_total: 0,
        total_projetos: 0
      };

      // Buscar dados por ano para este programa
      for (const ano of anos) {
        // Valores por ano
        const [valorRows] = await conn.query<ProjetoRow[]>(`
          SELECT 
            COALESCE(SUM(
              CAST(REPLACE(REPLACE(REPLACE(REPLACE(COALESCE(valor_aprovado, '0'), '.', ''), ',', '.'), ' ', ''), 'R$', '') AS DECIMAL(15,2))
            ), 0) AS valor_total
          FROM projetos
          WHERE codigo_programa = ?
          AND codigo_situacao = 4
          AND YEAR(final) = ?
          AND responsavel != ''
          AND responsavel IS NOT NULL
        `, [programa.id, ano]);

        // Quantidade de projetos por ano
        const [qtdRows] = await conn.query<ProjetoRow[]>(`
          SELECT COUNT(*) AS total_projetos
          FROM projetos
          WHERE codigo_programa = ?
          AND codigo_situacao = 4
          AND YEAR(final) = ?
          AND responsavel != ''
          AND responsavel IS NOT NULL
        `, [programa.id, ano]);

        const valorAno = Number(valorRows?.[0]?.valor_total) || 0;
        const qtdAno = Number(qtdRows?.[0]?.total_projetos) || 0;

        programaData.valores_por_ano[ano] = valorAno;
        programaData.projetos_por_ano[ano] = qtdAno;

        // Acumular nos totais gerais
        totaisGerais.valores_por_ano[ano] += valorAno;
        totaisGerais.projetos_por_ano[ano] += qtdAno;

        // NOVO: Acumular especificamente para o ano vigente
        if (ano === anoAtual) {
          totaisGerais.valor_ano_vigente += valorAno;
          totaisGerais.projetos_ano_vigente += qtdAno;
        }
      }

      // Calcular totais do programa (todos os anos)
      const [valorTotalRows] = await conn.query<ProjetoRow[]>(`
        SELECT 
          COALESCE(SUM(
            CAST(REPLACE(REPLACE(REPLACE(REPLACE(COALESCE(valor_aprovado, '0'), '.', ''), ',', '.'), ' ', ''), 'R$', '') AS DECIMAL(15,2))
          ), 0) AS valor_total
        FROM projetos
        WHERE codigo_programa = ?
        AND codigo_situacao = 4
        AND responsavel != ''
        AND responsavel IS NOT NULL
      `, [programa.id]);

      const [qtdTotalRows] = await conn.query<ProjetoRow[]>(`
        SELECT COUNT(*) AS total_projetos
        FROM projetos
        WHERE codigo_programa = ?
        AND codigo_situacao = 4
        AND responsavel != ''
        AND responsavel IS NOT NULL
      `, [programa.id]);

      programaData.valor_total = Number(valorTotalRows?.[0]?.valor_total) || 0;
      programaData.total_projetos = Number(qtdTotalRows?.[0]?.total_projetos) || 0;

      // Acumular nos totais gerais (período completo)
      totaisGerais.valor_total_geral += programaData.valor_total;
      totaisGerais.total_projetos_geral += programaData.total_projetos;

      programas.push(programaData);
    }

    return NextResponse.json({ 
      success: true,
      programas: programas,
      anos: anos,
      totais_gerais: totaisGerais,
      ano_vigente: anoAtual
    });

  } catch (error) {
    console.error('Erro ao buscar dados dos projetos:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor',
        programas: [],
        anos: [],
        totais_gerais: {
          valores_por_ano: {},
          projetos_por_ano: {},
          valor_total_geral: 0,
          total_projetos_geral: 0,
          valor_ano_vigente: 0,
          projetos_ano_vigente: 0
        },
        ano_vigente: new Date().getFullYear()
      },
      { status: 500 }
    );
  }
}