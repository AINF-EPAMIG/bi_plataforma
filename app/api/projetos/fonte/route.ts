import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface Row extends RowDataPacket {
  fonte_financiadora: string;
  ano_final: number | null;
  total_projetos: number;
}

interface FonteData {
  nome: string;
  projetos_por_ano: Record<number, number>;
  total_projetos: number;
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

    // Filtro opcional de fonte específica
    const fonteNome = searchParams.get("fonte");

    // Query: agrupa por fonte e ano
    const whereFonte = fonteNome ? "AND COALESCE(NULLIF(p.fonte_financiadora, ''), 'Fonte Não Informada') = ?" : "";
    const params: Array<string | number> = [inicioIntervalo, fimIntervaloExclusivo];
    if (fonteNome) params.push(fonteNome);

    const sql = `
      SELECT 
        COALESCE(NULLIF(p.fonte_financiadora, ''), 'Fonte Não Informada') AS fonte_financiadora,
        YEAR(p.final) AS ano_final,
        COUNT(p.id) AS total_projetos
      FROM projetos p
      WHERE p.codigo_situacao = 4
        AND p.responsavel IS NOT NULL
        AND p.responsavel != ''
        AND p.final IS NOT NULL
        AND p.final >= ?
        AND p.final < ?
        ${whereFonte}
      GROUP BY fonte_financiadora, YEAR(p.final)
      ORDER BY fonte_financiadora, ano_final
    `;

    const [rows] = await conn.query<Row[]>(sql, params);

    // Estruturação
    const fontesMap = new Map<string, FonteData>();
    const totaisGerais = {
      projetos_por_ano: {} as Record<number, number>,
      total_projetos_geral: 0,
    };

    anos.forEach((a) => {
      totaisGerais.projetos_por_ano[a] = 0;
    });

    for (const r of rows) {
      const nome = r.fonte_financiadora || "Fonte Não Informada";
      if (!fontesMap.has(nome)) {
        fontesMap.set(nome, {
          nome,
          projetos_por_ano: {},
          total_projetos: 0,
        });
      }
      if (r.ano_final !== null) {
        const ano = r.ano_final;
        const qtd = Number(r.total_projetos || 0);
        const f = fontesMap.get(nome)!;
        f.projetos_por_ano[ano] = qtd;
        f.total_projetos += qtd;
        if (anos.includes(ano)) {
          totaisGerais.projetos_por_ano[ano] += qtd;
        }
      }
    }

    for (const f of fontesMap.values()) {
      totaisGerais.total_projetos_geral += f.total_projetos;
    }

    // Lista de fontes (para o dropdown de filtro)
    const fontes = Array.from(fontesMap.values()).sort((a, b) =>
      a.nome.localeCompare(b.nome)
    );

    const body = {
      success: true,
      anos,
      fontes,
      totais_gerais: totaisGerais,
      range: { inicio: anoInicial, fim: anoFinal },
    };

    return NextResponse.json(body);
  } catch (err) {
    console.error("Erro na API de fonte financiadora:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        anos: [],
        fontes: [],
        totais_gerais: {
          projetos_por_ano: {},
          total_projetos_geral: 0,
        },
      },
      { status: 500 }
    );
  }
}
