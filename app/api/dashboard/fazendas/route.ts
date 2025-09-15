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
    
    // Consulta corrigida: inclui sigla_fazenda
    const [rows] = await conn.query<FazendaRow[]>(`
      SELECT 
        f.id,
        f.nome_fazenda,
        f.sigla_fazenda, -- CORREÇÃO AQUI!
        r.nome as nome_regional,
        COALESCE(COUNT(u.id), 0) AS total
      FROM fazenda f
      LEFT JOIN regional r ON f.regional_id = r.id
      LEFT JOIN usuario u 
        ON f.id = u.fazenda_id
        AND u.status = 1 
        AND u.tipo = 'Pesquisador'
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