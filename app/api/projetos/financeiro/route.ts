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

    const dados: ProgramaFinanceiro[] = [];
    let totalGeralQuantitativo = 0;
    let totalGeralValor = 0;

    // Para cada programa, buscar quantitativo e valor
    for (const programa of programas) {
      // Quantitativo de projetos EPAMIG (com responsável)
      const [countResult] = await conn.query<CountRow[]>(`
        SELECT COUNT(*) as total 
        FROM projetos 
        WHERE codigo_programa = ? 
          AND codigo_situacao = '4' 
          AND responsavel IS NOT NULL 
          AND responsavel != ''
      `, [programa.id]);

      const quantitativo = countResult[0]?.total || 0;

      // Valor aprovado EPAMIG (com responsável)
      const [valorResult] = await conn.query<ValorRow[]>(`
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
      `, [programa.id]);

      const valorAprovado = Number(valorResult[0]?.TotalDaSoma) || 0;

      dados.push({
        id: programa.id,
        programa: programa.nome,
        quantitativo,
        valorAprovado,
        valorFormatado: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(valorAprovado)
      });

      totalGeralQuantitativo += quantitativo;
      totalGeralValor += valorAprovado;
    }

    return NextResponse.json({
      success: true,
      programas: dados,
      totais: {
        quantitativo: totalGeralQuantitativo,
        valor: totalGeralValor,
        valorFormatado: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(totalGeralValor)
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
          valorFormatado: 'R$ 0,00'
        }
      },
      { status: 500 }
    );
  }
}
