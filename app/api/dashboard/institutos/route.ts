import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface InstitutoData {
  id: number | null; // pode ser null se o registro não existir na tabela regional
  nome: string;
  total: number;
}

interface InstitutosResponse {
  success: boolean;
  institutos: InstitutoData[];
  totalGeral: number;
  error?: string;
}

export async function GET() {
  try {
    const result = await query(
      `
      SELECT 
        r.id,
        r.nome,
        COUNT(u.id) AS total
      FROM regional r
      LEFT JOIN usuario u 
             ON u.regional_id = r.id
            AND u.status = 1
            AND u.tipo = 'Pesquisador'
      WHERE r.nome IN ('ILCT', 'ITAP')
      GROUP BY r.id, r.nome
      ORDER BY total DESC;
      `
    );

    const institutos = (result as unknown as InstitutoData[]) || [];
    const totalGeral = institutos.reduce((sum, inst) => sum + (Number(inst.total) || 0), 0);

    const response: InstitutosResponse = {
      success: true,
      institutos,
      totalGeral,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro ao buscar dados dos institutos:', error);
    return NextResponse.json(
      { success: false, institutos: [], totalGeral: 0, error: 'Erro interno do servidor' } as InstitutosResponse,
      { status: 500 }
    );
  }
}
