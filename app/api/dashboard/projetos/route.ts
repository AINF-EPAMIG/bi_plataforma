import { NextResponse, NextRequest } from "next/server";

export const dynamic = 'force-dynamic';
import { getConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface ProjetoResultRow extends RowDataPacket {
  programa_id: number;
  programa_nome: string;
  ano_final: number | null;
  valor_ano: number;
  projetos_ano: number;
}

interface ProgramaData {
  id: number;
  nome: string;
  valores_por_ano: { [ano: string]: number };
  projetos_por_ano: { [ano: string]: number };
  valor_total: number;
  total_projetos: number;
}

export async function GET(request: NextRequest) {
  try {
    const conn = await getConnection();
    const { searchParams } = new URL(request.url);
    const regionalParam = (searchParams.get('regional') || '').toUpperCase();
    const regionalIdParam = parseInt(searchParams.get('regionalId') || '', 10);
    const labelToId: Record<string, number> = {
      'SEDE': 1,
      'CENTRO OESTE': 2,
      'NORTE': 3,
      'OESTE': 4,
      'SUL': 5,
      'SUDESTE': 6,
      'ILCT': 7,
      'ITAP': 8,
    };
    const selectedRegionalId = Number.isFinite(regionalIdParam)
      ? regionalIdParam
      : (regionalParam && regionalParam !== 'GERAL' ? labelToId[regionalParam] : undefined);
  const hasRegionalId = typeof selectedRegionalId === 'number' && Number.isFinite(selectedRegionalId);
    
  // Gerar anos dinamicamente (ano atual + 4 anos)
  const anoAtual = new Date().getFullYear();
  const anos = Array.from({ length: 5 }, (_, i) => anoAtual + i);
  // Intervalo de datas sargável para aproveitar índice em `final`
  const inicioIntervalo = `${anoAtual}-01-01`;
  const fimIntervaloExclusivo = `${anoAtual + 5}-01-01`; // exclusivo (>= inicio, < fim)
    
    // CONSULTA OTIMIZADA: Uma única consulta para todos os dados
    // Montar filtro regional apenas por ID numérico (coluna p.unidade)
    const queryParamsBase = [inicioIntervalo, fimIntervaloExclusivo] as (string)[];
    const regionalFilter = hasRegionalId ? 'AND p.unidade = ?' : '';
    const regionalParams: Array<number> = hasRegionalId ? [selectedRegionalId as number] : [];
    const queryParams = [...queryParamsBase, ...regionalParams];
    
    const [resultRows] = await conn.query<ProjetoResultRow[]>(`
      SELECT 
        pr.id as programa_id,
        pr.nome as programa_nome,
        YEAR(p.final) as ano_final,
        COALESCE(SUM(
          CASE 
            WHEN p.valor_aprovado IS NULL OR p.valor_aprovado = '' THEN 0
            ELSE CAST(
              REPLACE(
                REPLACE(
                  REPLACE(
                    REPLACE(p.valor_aprovado, '.', ''), 
                    ',', '.'
                  ), 
                  ' ', ''
                ), 
                'R$', ''
              ) AS DECIMAL(15,2)
            )
          END
        ), 0) as valor_ano,
        COUNT(*) as projetos_ano
      FROM programa pr
      LEFT JOIN projetos p ON pr.id = p.codigo_programa
        AND p.codigo_situacao = 4
        AND p.responsavel IS NOT NULL 
        AND p.responsavel != ''
  AND p.final IS NOT NULL
  AND p.final >= ? AND p.final < ?
  ${regionalFilter}
      WHERE pr.id NOT IN (5, 8, 17, 18, 19, 6, 4, 15, 12, 2)
      GROUP BY pr.id, pr.nome, YEAR(p.final)
      ORDER BY pr.nome, ano_final
  `, queryParams);

    // Processar resultados
    const programasMap = new Map<number, ProgramaData>();
    const totaisGerais = {
      valores_por_ano: {} as { [ano: string]: number },
      projetos_por_ano: {} as { [ano: string]: number },
      valor_total_geral: 0,
      total_projetos_geral: 0,
      valor_ano_vigente: 0,
      projetos_ano_vigente: 0
    };

    // Inicializar totais por ano
    anos.forEach(ano => {
      totaisGerais.valores_por_ano[ano] = 0;
      totaisGerais.projetos_por_ano[ano] = 0;
    });

    // Processar resultados da consulta
    for (const row of resultRows) {
      const programaId = row.programa_id;
      
      if (!programasMap.has(programaId)) {
        programasMap.set(programaId, {
          id: programaId,
          nome: row.programa_nome,
          valores_por_ano: {},
          projetos_por_ano: {},
          valor_total: 0,
          total_projetos: 0
        });
      }

      const programa = programasMap.get(programaId)!;
      
      if (row.ano_final) {
        const ano = row.ano_final;
        const valorAno = Number(row.valor_ano) || 0;
        const projetosAno = Number(row.projetos_ano) || 0;

        programa.valores_por_ano[ano] = valorAno;
        programa.projetos_por_ano[ano] = projetosAno;

        // Acumular totais do programa
        programa.valor_total += valorAno;
        programa.total_projetos += projetosAno;

        // Acumular nos totais gerais
        totaisGerais.valores_por_ano[ano] += valorAno;
        totaisGerais.projetos_por_ano[ano] += projetosAno;

        // Acumular para o ano vigente
        if (ano === anoAtual) {
          totaisGerais.valor_ano_vigente += valorAno;
          totaisGerais.projetos_ano_vigente += projetosAno;
        }
      }
    }

    // Acumular totais gerais
    for (const programa of programasMap.values()) {
      totaisGerais.valor_total_geral += programa.valor_total;
      totaisGerais.total_projetos_geral += programa.total_projetos;
    }

    const programas = Array.from(programasMap.values());

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