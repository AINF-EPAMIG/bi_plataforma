import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2";

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

interface ProgramaFinanceiro {
  id: number;
  programa: string;
  quantitativo: number;
  valorAprovado: number;
  valorFormatado: string;
  quantitativoEpamig: number;
  valorAprovadoEpamig: number;
  valorFormatadoEpamig: string;
}

export async function GET() {
  try {
    const conn = await getConnection();
    
    // Buscar programas (excluindo IDs específicos) - Igual ao PHP
    const [programas] = await conn.query<ProgramaRow[]>(`
      SELECT * FROM programa 
      WHERE id != 5 AND id != 8 AND id != 17 AND id != 18 AND id != 19 
        AND id != 6 AND id != 4 AND id != 15 AND id != 12 AND id != 2 
      ORDER BY nome
    `);

    // Buscar totais gerais UMA VEZ (não por programa) - Igual ao PHP
    // Total geral de projetos (todos os programas)
    const [totalGeralResult] = await conn.query<CountRow[]>(`
      SELECT COUNT(*) as total 
      FROM projetos 
      WHERE codigo_situacao = '4' 
        AND codigo_programa IS NOT NULL 
        AND codigo_programa != ''
    `);
    const totalProgramaGeral = totalGeralResult[0]?.total || 0;

    // Total geral de projetos EPAMIG (todos os programas)
    const [totalGeralEpamigResult] = await conn.query<CountRow[]>(`
      SELECT COUNT(*) as total 
      FROM projetos 
      WHERE codigo_situacao = '4' 
        AND codigo_programa IS NOT NULL 
        AND codigo_programa != ''
        AND responsavel IS NOT NULL
        AND responsavel != ''
    `);
    const totalProgramaGeralEpamig = totalGeralEpamigResult[0]?.total || 0;

    // Valor total geral (todos os programas)
    const [valorTotalGeralResult] = await conn.query<ValorRow[]>(`
      SELECT SUM(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(valor_aprovado, '.', ''), 
              ',', '.'
            ), 
            ' ', ''
          ), 
          'R$', ''
        )
      ) AS TotalDaSoma
      FROM projetos 
      WHERE codigo_situacao = '4' 
        AND codigo_programa IS NOT NULL 
        AND codigo_programa != ''
    `);
    const sqlTotal = Number(valorTotalGeralResult[0]?.TotalDaSoma) || 0;

    // Valor total geral EPAMIG (todos os programas)
    const [valorTotalGeralEpamigResult] = await conn.query<ValorRow[]>(`
      SELECT SUM(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(valor_aprovado, '.', ''), 
              ',', '.'
            ), 
            ' ', ''
          ), 
          'R$', ''
        )
      ) AS TotalDaSoma
      FROM projetos 
      WHERE codigo_situacao = '4' 
        AND codigo_programa IS NOT NULL 
        AND codigo_programa != ''
        AND responsavel IS NOT NULL
        AND responsavel != ''
    `);
    const sqlTotalEpamig = Number(valorTotalGeralEpamigResult[0]?.TotalDaSoma) || 0;

    const dados: ProgramaFinanceiro[] = [];

    // Para cada programa, buscar quantitativo e valor
    for (const programa of programas) {
      // Quantitativo TOTAL de projetos por programa - Igual ao PHP
      const [countTotalResult] = await conn.query<CountRow[]>(`
        SELECT COUNT(codigo_programa) as total 
        FROM projetos 
        WHERE codigo_programa = ? 
          AND codigo_situacao = '4'
      `, [programa.id]);
      const quantitativo = countTotalResult[0]?.total || 0;

      // Quantitativo de projetos EPAMIG por programa - Igual ao PHP
      const [countEpamigResult] = await conn.query<CountRow[]>(`
        SELECT COUNT(codigo_programa) as total 
        FROM projetos 
        WHERE codigo_programa = ? 
          AND codigo_situacao = '4' 
          AND responsavel != ''
      `, [programa.id]);
      const quantitativoEpamig = countEpamigResult[0]?.total || 0;

      // Valor aprovado TOTAL por programa - Igual ao PHP (SEM filtros adicionais)
      const [valorTotalResult] = await conn.query<ValorRow[]>(`
        SELECT SUM(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(valor_aprovado, '.', ''), 
                ',', '.'
              ), 
              ' ', ''
            ), 
            'R$', ''
          )
        ) AS TotalDaSoma
        FROM projetos 
        WHERE codigo_programa = ? 
          AND codigo_situacao = '4'
      `, [programa.id]);
      const valorAprovado = Number(valorTotalResult[0]?.TotalDaSoma) || 0;

      // Valor aprovado EPAMIG por programa - Igual ao PHP
      const [valorEpamigResult] = await conn.query<ValorRow[]>(`
        SELECT SUM(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(valor_aprovado, '.', ''), 
                ',', '.'
              ), 
              ' ', ''
            ), 
            'R$', ''
          )
        ) AS TotalDaSoma
        FROM projetos 
        WHERE codigo_programa = ? 
          AND codigo_situacao = '4' 
          AND responsavel != ''
      `, [programa.id]);
      const valorAprovadoEpamig = Number(valorEpamigResult[0]?.TotalDaSoma) || 0;

      dados.push({
        id: programa.id,
        programa: programa.nome,
        quantitativo,
        valorAprovado,
        valorFormatado: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(valorAprovado),
        quantitativoEpamig,
        valorAprovadoEpamig,
        valorFormatadoEpamig: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(valorAprovadoEpamig)
      });
    }

    return NextResponse.json({
      success: true,
      programas: dados,
      totais: {
        quantitativo: totalProgramaGeral,
        valor: sqlTotal,
        valorFormatado: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(sqlTotal),
        quantitativoEpamig: totalProgramaGeralEpamig,
        valorEpamig: sqlTotalEpamig,
        valorFormatadoEpamig: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(sqlTotalEpamig)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar dados financeiros:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor',
        programas: [],
        totais: {
          quantitativo: 0,
          valor: 0,
          valorFormatado: 'R$ 0,00',
          quantitativoEpamig: 0,
          valorEpamig: 0,
          valorFormatadoEpamig: 'R$ 0,00'
        }
      },
      { status: 500 }
    );
  }
}
