import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface RegionalData {
  id: number;
  nome: string;
  total: number;
}

// Removida a interface QuantitativoRow que não estava sendo usada

export async function GET() {
  try {
    const result = await query(`
     SELECT 
    r.id,
    r.nome,
    COUNT(u.id) AS total
FROM regional r
LEFT JOIN usuario u 
       ON u.regional_id = r.id
      AND u.status = 1
      AND u.tipo = 'Pesquisador'
GROUP BY r.id, r.nome
ORDER BY total DESC;

    `);

    const regionais = result as RegionalData[];
    const totalGeral = regionais.reduce((sum, regional) => sum + regional.total, 0);

    return NextResponse.json({
      success: true,
      regionais,
      totalGeral
    });
  } catch (error) {
    console.error('Erro ao buscar dados das regionais:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
