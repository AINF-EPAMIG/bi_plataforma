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
        1 as id,
        'Campo Experimental Prudente de Morais' as nome_fazenda,
        'CEPM' as sigla_fazenda,
        'Regional Centro-Oeste' as nome_regional,
        COUNT(CASE WHEN tipo = 'admin' THEN 1 END) AS total
      FROM usuario WHERE status = 1
      UNION ALL
      SELECT 
        2 as id,
        'Campo Experimental Lavras' as nome_fazenda,
        'CEL' as sigla_fazenda,
        'Regional Sul de Minas' as nome_regional,
        COUNT(CASE WHEN tipo = 'chefia' THEN 1 END) AS total
      FROM usuario WHERE status = 1
      UNION ALL
      SELECT 
        3 as id,
        'Campo Experimental Uberaba' as nome_fazenda,
        'CEU' as sigla_fazenda,
        'Regional Triângulo' as nome_regional,
        COUNT(CASE WHEN tipo = 'usuario' THEN 1 END) AS total
      FROM usuario WHERE status = 1
      ORDER BY nome_regional, nome_fazenda
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