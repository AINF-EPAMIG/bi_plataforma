import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface FazendaRow extends RowDataPacket {
  id: number;
  nome_fazenda: string;
  sigla_fazenda: string; // Adicionado!
  nome_regional: string;
  total: number;
}

interface FazendaData {
  id: number;
  nome_fazenda: string;
  sigla_fazenda: string; // Adicionado!
  nome_regional: string;
  total: number;
}

export async function GET() {
  try {
    const conn = await getConnection();
    
    // Consulta simulada usando apenas a tabela usuario existente
    // Simulando fazendas baseadas nos tipos de usuário
    const [rows] = await conn.query<FazendaRow[]>(`
     SELECT 
    f.id,
    f.nome_fazenda,
    f.sigla_fazenda,
    r.nome AS nome_regional,
    COUNT(u.id) AS total
FROM fazenda f
INNER JOIN regional r ON r.id = f.regional_id
LEFT JOIN usuario u 
       ON u.fazenda_id = f.id 
      AND u.status = 1   -- só usuários ativos
      AND u.tipo = 'pesquisador'  -- ou 'admin', 'chefia' etc.
GROUP BY f.id, f.nome_fazenda, f.sigla_fazenda, r.nome
ORDER BY r.nome, f.nome_fazenda;
    `);

    // Mapeamento corrigido
    const data: FazendaData[] = rows.map((row) => ({
      id: row.id,
      nome_fazenda: row.nome_fazenda,
      sigla_fazenda: row.sigla_fazenda, // CORREÇÃO AQUI!
      nome_regional: row.nome_regional,
      total: Number(row.total) || 0,
    }));

    return NextResponse.json({ 
      success: true,
      fazendas: data,
      totalGeral: data.reduce((acc, item) => acc + item.total, 0)
    });

  } catch (error) {
    console.error('Erro ao buscar dados das fazendas:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor',
        fazendas: [],
        totalGeral: 0
      },
      { status: 500 }
    );
  }
}