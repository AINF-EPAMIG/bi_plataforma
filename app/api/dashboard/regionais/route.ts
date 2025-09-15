import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface RegionalRow extends RowDataPacket {
  id: number;
  nome: string;
}

interface QuantitativoRow extends RowDataPacket {
  regional_id: number;
  total: number;
}

interface RegionalData {
  id: number;
  nome: string;
  total: number;
}

export async function GET() {
  try {
    const conn = await getConnection();
    
    // Consulta otimizada com LEFT JOIN para melhor performance
    const [rows] = await conn.query<RegionalRow[]>(`
    SELECT 
    r.id,
    r.nome,
    COALESCE(COUNT(u.id), 0) AS total
FROM regional r
LEFT JOIN usuario u 
    ON r.id = u.regional_id
   AND u.status = 1 
   AND u.tipo = 'Pesquisador'
GROUP BY r.id, r.nome
ORDER BY r.nome;

    `);

    // Transforma o resultado em formato adequado para o dashboard
    const data: RegionalData[] = rows.map((row) => ({
      id: row.id,
      nome: row.nome,
      total: Number(row.total) || 0,
    }));

    return NextResponse.json({ 
      success: true,
      regionais: data,
      totalGeral: data.reduce((acc, item) => acc + item.total, 0)
    });

  } catch (error) {
    console.error('Erro ao buscar dados das regionais:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor',
        regionais: [],
        totalGeral: 0
      },
      { status: 500 }
    );
  }
}
