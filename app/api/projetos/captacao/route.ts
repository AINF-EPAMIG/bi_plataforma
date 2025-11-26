import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export const dynamic = 'force-dynamic';

interface CaptacaoRow extends RowDataPacket {
  ano_equipe: number;
  unidade_id: number;
  nome_unidade: string;
  total_captado: number;
  num_projetos: number;
}

interface UnidadeData {
  id: number;
  nome: string;
  captacao_por_ano: Record<number, { valor: number; projetos: number }>;
  total_captado: number;
  total_projetos: number;
}

interface AnoTotal {
  ano: number;
  total_captado: number;
  total_projetos: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const anosParam = searchParams.get('anos'); // Agora aceita múltiplos anos separados por vírgula
  const unidadesParam = searchParams.get('unidades'); // Aceita múltiplas unidades separadas por vírgula

  // Anos padrão: ano atual e anos adicionais (2023, 2022) quando nenhum ano for informado
  const currentYear = new Date().getFullYear();
  const parsedAnos = anosParam ? anosParam.split(',').map(a => parseInt(a.trim())).filter(a => !isNaN(a)) : [];
  const DEFAULT_ADDITIONAL_YEARS: number[] = [2023, 2022];
  const anos = parsedAnos.length > 0
    ? parsedAnos
    : Array.from(new Set([currentYear, currentYear - 1, ...DEFAULT_ADDITIONAL_YEARS]));
  
  const unidadeIds = unidadesParam
    ? unidadesParam.split(',').map(u => parseInt(u.trim())).filter(u => !isNaN(u))
    : [];

  let conn;
  try {
    conn = await getConnection();

    // Query para captação de recursos por unidade/regional e ano
    let sql = `
      SELECT 
        e.ano_equipe,
        u.id AS unidade_id,
        u.nome AS nome_unidade,
        SUM(p.valor_captado) AS total_captado,
        COUNT(DISTINCT p.id) AS num_projetos
      FROM equipes e
      JOIN projeto45 p ON e.id_projeto45 = p.id
      JOIN regional u ON p.unidade_id = u.id
      WHERE (e.indicador_equipe = 207 OR e.indicador_equipe = 208)
        AND e.situacao_equipe = 2
        AND e.ano_equipe IN (${anos.map(() => '?').join(',')})
    `;

    const params: number[] = [...anos];

    // Filtro opcional por unidades
    if (unidadeIds.length > 0) {
      sql += ` AND u.id IN (${unidadeIds.map(() => '?').join(',')})`;
      params.push(...unidadeIds);
    }

    sql += ` GROUP BY e.ano_equipe, u.id, u.nome ORDER BY u.nome ASC, e.ano_equipe ASC`;

    const [rows] = await conn.query<CaptacaoRow[]>(sql, params);

    // Agrupar dados por unidade
    const unidadesMap = new Map<number, UnidadeData>();
    
    rows.forEach(row => {
      const unidadeId = row.unidade_id;
      const ano = row.ano_equipe;
      const valorCaptado = parseFloat(String(row.total_captado)) || 0;
      const numProjetos = row.num_projetos || 0;

      if (!unidadesMap.has(unidadeId)) {
        unidadesMap.set(unidadeId, {
          id: unidadeId,
          nome: row.nome_unidade,
          captacao_por_ano: {},
          total_captado: 0,
          total_projetos: 0,
        });
      }

      const unidade = unidadesMap.get(unidadeId)!;
      unidade.captacao_por_ano[ano] = { valor: valorCaptado, projetos: numProjetos };
      unidade.total_captado += valorCaptado;
      unidade.total_projetos += numProjetos;
    });

    const unidades = Array.from(unidadesMap.values());

    // Calcular totais por ano
    const totaisPorAno: AnoTotal[] = anos.map(ano => {
      const totalCaptado = rows
        .filter(r => r.ano_equipe === ano)
        .reduce((sum, r) => sum + (parseFloat(String(r.total_captado)) || 0), 0);
      
      const totalProjetos = rows
        .filter(r => r.ano_equipe === ano)
        .reduce((sum, r) => sum + (r.num_projetos || 0), 0);

      return {
        ano,
        total_captado: totalCaptado,
        total_projetos: totalProjetos,
      };
    });

    // Total geral (todos os anos somados)
    const totalGeralCaptado = totaisPorAno.reduce((sum, t) => sum + t.total_captado, 0);
    const totalGeralProjetos = totaisPorAno.reduce((sum, t) => sum + t.total_projetos, 0);

    // Buscar lista de unidades disponíveis para o dropdown
    const sqlUnidades = `
      SELECT DISTINCT u.id, u.nome
      FROM regional u
      JOIN projeto45 p ON p.unidade_id = u.id
      JOIN equipes e ON e.id_projeto45 = p.id
      WHERE (e.indicador_equipe = 207 OR e.indicador_equipe = 208)
        AND e.situacao_equipe = 2
      ORDER BY u.nome ASC
    `;
    const [unidadesDisponiveis] = await conn.query<RowDataPacket[]>(sqlUnidades);

    // Buscar anos disponíveis para o dropdown
    const sqlAnos = `
      SELECT DISTINCT e.ano_equipe
      FROM equipes e
      WHERE (e.indicador_equipe = 207 OR e.indicador_equipe = 208)
        AND e.situacao_equipe = 2
        AND e.ano_equipe IS NOT NULL
      ORDER BY e.ano_equipe DESC
    `;
    const [anosDisponiveis] = await conn.query<RowDataPacket[]>(sqlAnos);
    // Mapear para array de números e garantir que 2023/2022 estejam presentes
    let anosDisponiveisArr: number[] = anosDisponiveis.map(a => a.ano_equipe);
    DEFAULT_ADDITIONAL_YEARS.forEach(y => { if (!anosDisponiveisArr.includes(y)) anosDisponiveisArr.push(y); });
    anosDisponiveisArr = Array.from(new Set(anosDisponiveisArr)).sort((a, b) => b - a);

    return NextResponse.json({
      success: true,
      anos_selecionados: anos,
      unidades,
      totais_por_ano: totaisPorAno,
      total_geral_captado: totalGeralCaptado,
      total_geral_projetos: totalGeralProjetos,
      unidades_disponiveis: unidadesDisponiveis.map(u => ({ id: u.id, nome: u.nome })),
      anos_disponiveis: anosDisponiveisArr,
    });

  } catch (error) {
    console.error('Erro ao buscar dados de captação:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      },
      { status: 500 }
    );
  }
}
