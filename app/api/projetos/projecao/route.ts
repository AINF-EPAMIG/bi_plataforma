import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface Row extends RowDataPacket {
  programa_id: number;
  programa_nome: string;
  ano_final: number | null;
  valor_ano: number | null;
  projetos_ano: number | null;
}

interface ProgramaData {
  id: number;
  nome: string;
  valores_por_ano: Record<number, number>;
  projetos_por_ano: Record<number, number>;
  valor_total: number;
  total_projetos: number;
}

function parseNumberList(param: string | null): number[] | undefined {
  if (!param) return undefined;
  const list = param
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n));
  return list.length ? list : undefined;
}

export async function GET(request: NextRequest) {
  try {
    const conn = await getConnection();

    const { searchParams } = new URL(request.url);

    // Intervalo de anos
    const nowYear = new Date().getFullYear();
    const startYear = parseInt(searchParams.get("startYear") || "", 10);
    const endYear = parseInt(searchParams.get("endYear") || "", 10);
    const anoInicial = Number.isFinite(startYear) ? startYear : nowYear;
    const anoFinal = Number.isFinite(endYear) && endYear >= anoInicial ? endYear : nowYear + 4;
    const anos = Array.from({ length: anoFinal - anoInicial + 1 }, (_, i) => anoInicial + i);
    const inicioIntervalo = `${anoInicial}-01-01`;
    const fimIntervaloExclusivo = `${anoFinal + 1}-01-01`;

    // Filtros opcionais
    const programaIds = parseNumberList(searchParams.get("programaIds"));
    const regionalId = parseInt(searchParams.get("regionalId") || "", 10);
    const hasRegional = Number.isFinite(regionalId);
    const search = (searchParams.get("search") || "").trim();

    // Exclusões conforme legado PHP
    const excluded = [5, 8, 17, 18, 19, 6, 4, 15, 12, 2];

    // Montagem dinâmica de filtros
    const wherePrograma: string[] = [
      `pr.id NOT IN (${excluded.map(() => "?").join(",")})`,
    ];
    const whereProgramaParams: Array<number | string> = [...excluded];

    if (search) {
      wherePrograma.push("pr.nome LIKE ?");
      whereProgramaParams.push(`%${search}%`);
    }
    if (programaIds && programaIds.length) {
      wherePrograma.push(`pr.id IN (${programaIds.map(() => "?").join(",")})`);
      whereProgramaParams.push(...programaIds);
    }

    const joinFilters: string[] = [
      "p.codigo_situacao = 4",
      "p.responsavel IS NOT NULL",
      "p.responsavel != ''",
      "p.final IS NOT NULL",
      "p.final >= ?",
      "p.final < ?",
    ];
    const joinParams: Array<string | number> = [inicioIntervalo, fimIntervaloExclusivo];
    if (hasRegional) {
      joinFilters.push("p.unidade = ?");
      joinParams.push(regionalId);
    }

    const sql = `
      SELECT 
        pr.id AS programa_id,
        pr.nome AS programa_nome,
        YEAR(p.final) AS ano_final,
        COALESCE(SUM(
          CASE 
            WHEN p.valor_aprovado IS NULL OR p.valor_aprovado = '' THEN 0
            ELSE CAST(
              REPLACE(REPLACE(REPLACE(REPLACE(p.valor_aprovado, '.', ''), ',', '.'), ' ', ''), 'R$', '')
              AS DECIMAL(15,2)
            )
          END
        ), 0) AS valor_ano,
        COUNT(p.id) AS projetos_ano
      FROM programa pr
      LEFT JOIN projetos p 
        ON pr.id = p.codigo_programa
       AND ${joinFilters.join(" AND ")}
      WHERE ${wherePrograma.join(" AND ")}
      GROUP BY pr.id, pr.nome, YEAR(p.final)
      ORDER BY pr.nome, ano_final`;

    const params = [...joinParams, ...whereProgramaParams];
    const [rows] = await conn.query<Row[]>(sql, params);

    // Estruturação
    const programasMap = new Map<number, ProgramaData>();
    const totaisGerais = {
      valores_por_ano: {} as Record<number, number>,
      projetos_por_ano: {} as Record<number, number>,
      valor_total_geral: 0,
      total_projetos_geral: 0,
    };

    anos.forEach((a) => {
      totaisGerais.valores_por_ano[a] = 0;
      totaisGerais.projetos_por_ano[a] = 0;
    });

    for (const r of rows) {
      const id = r.programa_id;
      if (!programasMap.has(id)) {
        programasMap.set(id, {
          id,
          nome: r.programa_nome,
          valores_por_ano: {},
          projetos_por_ano: {},
          valor_total: 0,
          total_projetos: 0,
        });
      }
      if (r.ano_final !== null) {
        const ano = r.ano_final;
        const valor = Number(r.valor_ano || 0);
        const qtd = Number(r.projetos_ano || 0);
        const p = programasMap.get(id)!;
        p.valores_por_ano[ano] = valor;
        p.projetos_por_ano[ano] = qtd;
        p.valor_total += valor;
        p.total_projetos += qtd;
        if (anos.includes(ano)) {
          totaisGerais.valores_por_ano[ano] += valor;
          totaisGerais.projetos_por_ano[ano] += qtd;
        }
      }
    }

    for (const p of programasMap.values()) {
      totaisGerais.valor_total_geral += p.valor_total;
      totaisGerais.total_projetos_geral += p.total_projetos;
    }

    const body = {
      success: true,
      anos,
      programas: Array.from(programasMap.values()),
      totais_gerais: totaisGerais,
      range: { inicio: anoInicial, fim: anoFinal },
    };

    return NextResponse.json(body);
  } catch (err) {
    console.error("Erro na API de projeção:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        anos: [],
        programas: [],
        totais_gerais: {
          valores_por_ano: {},
          projetos_por_ano: {},
          valor_total_geral: 0,
          total_projetos_geral: 0,
        },
      },
      { status: 500 }
    );
  }
}
