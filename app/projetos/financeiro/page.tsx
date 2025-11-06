"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ScienceIcon from '@mui/icons-material/Science';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LanguageIcon from '@mui/icons-material/Language';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleIcon from '@mui/icons-material/People';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const menuItems = [
  {
    label: "Projetos",
    icon: <AssignmentIcon fontSize="small" className="text-[#025C3E]" />,
    sub: [
      { label: "Financeiro", href: "/projetos/financeiro" },
      { label: "Finalizados", href: "/projetos/finalizados" },
    ],
  },
  {
    label: "Publicações",
    icon: <MenuBookIcon fontSize="small" className="text-[#025C3E]" />,
    sub: [
      { label: "Artigos", href: "/publicacoes/artigos" },
      { label: "Livros", href: "/publicacoes/livros" },
    ],
  },
  {
    label: "Tecnologias",
    icon: <ScienceIcon fontSize="small" className="text-[#303836]" />,
    sub: [
      { label: "Patentes", href: "/tecnologias/patentes" },
      { label: "Mercado", href: "/tecnologias/mercado" },
    ],
  },
  {
    label: "Eventos",
    icon: <CalendarMonthIcon fontSize="small" className="text-[#025C3E]" />,
    sub: [
      { label: "Próximos", href: "/eventos/proximos" },
      { label: "Passados", href: "/eventos/passados" },
    ],
  },
];

interface ProgramaFinanceiro {
  id: number;
  programa: string;
  quantitativo: number;
  valorAprovado: number;
  valorFormatado: string;
}

interface FinanceiroData {
  programas: ProgramaFinanceiro[];
  totais: {
    quantitativo: number;
    valor: number;
    valorFormatado: string;
  };
}

const COLORS = [
  "#10B981", "#14B8A6", "#06B6D4", "#0EA5E9", 
  "#3B82F6", "#8B5CF6", "#A855F7", "#EC4899",
  "#F59E0B", "#EF4444", "#84CC16", "#06B6D4"
];

export default function ProjetosFinanceiro() {
  const [data, setData] = useState<FinanceiroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'tabela' | 'grafico'>('grafico'); // Padrão: gráfico
  const [openMenu, setOpenMenu] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenMenu(-1);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/projetos/financeiro');
        const result = await response.json();

        if (result.success) {
          setData(result);
        }
      } catch (error) {
        console.error('Erro ao buscar dados financeiros:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Preparar dados para os gráficos
  const chartDataQuantitativo = data ? data.programas.map(p => ({
    nome: p.programa.length > 20 ? p.programa.substring(0, 20) + '...' : p.programa,
    nomeCompleto: p.programa,
    valor: p.quantitativo
  })) : [];

  const chartDataValor = data ? data.programas.map(p => ({
    nome: p.programa.length > 20 ? p.programa.substring(0, 20) + '...' : p.programa,
    nomeCompleto: p.programa,
    valor: p.valorAprovado
  })) : [];

  return (
    <div className="flex min-h-screen bg-[#f6f8f9] overflow-x-hidden">
      {/* Menu Lateral */}
      <aside className="bg-white border-r-8 border-[#025C3E] w-20 md:w-64 h-screen flex flex-col items-center py-8 fixed left-0 top-0 z-40 shadow-lg overflow-y-auto">
        <div className="flex flex-col items-center w-full">
          <img src="/epamig.svg" alt="Logo EPAMIG" className="w-28 h-28 mb-3" />
          <Link
            href="/inicio"
            className="flex items-center gap-2 bg-[#025C3E] text-white px-5 py-2 rounded-2xl shadow hover:bg-[#038451] transition mb-8 mt-2"
          >
            <HomeIcon fontSize="medium" /> <span className="font-bold hidden md:inline">Início</span>
          </Link>
        </div>
        <nav className="flex-1 w-full px-2" ref={dropdownRef}>
          <ul className="space-y-2">
            {menuItems.map((item, idx) => (
              <li key={item.label} className="relative">
                <button
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl border border-transparent transition-all shadow hover:border-[#025C3E] hover:bg-[#E3F7EF] focus:bg-[#E3F7EF] group
                  ${openMenu === idx ? "bg-[#E3F7EF] border-[#025C3E]" : ""}`}
                  onClick={() => setOpenMenu(openMenu === idx ? -1 : idx)}
                  aria-expanded={openMenu === idx}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-[#025C3E] text-base md:text-lg font-semibold hidden md:inline">{item.label}</span>
                  </div>
                  <span
                    className={`text-[#025C3E] transform transition-transform duration-300 hidden md:inline ${
                      openMenu === idx ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <svg width={20} height={20}><path d="M7 10l5 0" stroke="#025C3E" strokeWidth={3} strokeLinecap="round" /></svg>
                  </span>
                </button>
                {openMenu === idx && (
                  <div className="absolute left-full top-0 md:static md:left-0 md:top-auto z-20 w-48 md:w-auto shadow-lg rounded-xl bg-white mt-2 animate-fadein border border-[#E3F7EF]">
                    <ul className="p-2">
                      {item.sub.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            className="block py-2 px-4 text-sm text-[#025C3E] rounded hover:bg-[#DFF6EC] font-medium transition"
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto pt-4 text-xs text-gray-400">EPAMIG © 2025</div>
      </aside>

      {/* HEADER FIXO + Main */}
      <div className="flex-1 ml-20 md:ml-64 flex flex-col">
        <header className="bg-white shadow-sm flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-4 md:py-5 border-b-2 border-[#025C3E] sticky top-0 z-30 w-full gap-3 md:gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-[#025C3E] leading-tight">Pesquisa360 EPAMIG</h1>
            <span className="block text-xs md:text-sm text-[#038451] font-medium mt-1">Onde a pesquisa se transforma em resultados.</span>
          </div>
          <nav className="flex items-center divide-x divide-gray-300">
            <Link
              href="https://www.epamig.br"
              target="_blank"
              rel="noopener"
              className="flex items-center gap-2 px-3 md:px-4 text-[#025C3E] hover:text-[#038451] font-semibold transition-colors duration-200 text-xs md:text-sm whitespace-nowrap"
            >
              <LanguageIcon fontSize="small" />
              <span className="hidden sm:inline">Conheça a EPAMIG</span>
              <span className="sm:hidden">EPAMIG</span>
            </Link>
            <Link
              href="https://www.livrariaepamig.com.br/"
              target="_blank"
              rel="noopener"
              className="flex items-center gap-2 px-3 md:px-4 text-[#025C3E] hover:text-[#038451] font-semibold transition-colors duration-200 text-xs md:text-sm whitespace-nowrap"
            >
              <LibraryBooksIcon fontSize="small" />
              <span className="hidden sm:inline">Nossa Livraria</span>
              <span className="sm:hidden">Livraria</span>
            </Link>
            <Link
              href="https://www.epamig.br/pesquisa/lista_pesquisadores/"
              target="_blank"
              rel="noopener"
              className="flex items-center gap-2 px-3 md:px-4 text-[#025C3E] hover:text-[#038451] font-semibold transition-colors duration-200 text-xs md:text-sm whitespace-nowrap"
            >
              <PeopleIcon fontSize="small" />
              <span className="hidden sm:inline">Pesquisadores e Assessores</span>
              <span className="sm:hidden">Pesq.</span>
            </Link>
            <Link
              href="https://www.epamig.br/pesquisa/programas-estaduais-de-pesquisa/"
              target="_blank"
              rel="noopener"
              className="flex items-center gap-2 px-3 md:px-4 text-[#025C3E] hover:text-[#038451] font-semibold transition-colors duration-200 text-xs md:text-sm whitespace-nowrap"
            >
              <ScienceOutlinedIcon fontSize="small" />
              <span className="hidden lg:inline">Programas Estaduais de Pesquisas (PEP)</span>
              <span className="hidden sm:inline lg:hidden">Programas (PEP)</span>
              <span className="sm:hidden">PEP</span>
            </Link>
          </nav>
        </header>

        <main className="p-4 md:p-6 lg:p-8 w-full max-w-[1600px] mx-auto">
          {/* Header da Página */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-[#025C3E]">
                  Projetos em Execução
                </h2>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  Dados financeiros por programa de pesquisa
                </p>
              </div>

              {/* Toggle View Mode */}
              {!loading && data && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grafico')}
                    className={`
                      px-3 md:px-5 py-2 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm
                      transition-all duration-300 flex items-center gap-1.5
                      ${viewMode === 'grafico' 
                        ? 'bg-[#025C3E] text-white shadow-lg scale-105' 
                        : 'bg-white text-[#025C3E] border-2 border-[#025C3E] hover:bg-[#E3F7EF]'
                      }
                    `}
                  >
                    <BarChartIcon fontSize="small" />
                    <span>Gráfico</span>
                  </button>
                  
                  <button
                    onClick={() => setViewMode('tabela')}
                    className={`
                      px-3 md:px-5 py-2 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm
                      transition-all duration-300 flex items-center gap-1.5
                      ${viewMode === 'tabela' 
                        ? 'bg-[#025C3E] text-white shadow-lg scale-105' 
                        : 'bg-white text-[#025C3E] border-2 border-[#025C3E] hover:bg-[#E3F7EF]'
                      }
                    `}
                  >
                    <TableChartIcon fontSize="small" />
                    <span>Tabela</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="animate-pulse">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-10 bg-gray-100 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {!loading && !data && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <p className="text-base text-gray-600">Erro ao carregar dados</p>
            </div>
          )}

          {/* Visualização Gráfico (PADRÃO - PRIMEIRO) */}
          {!loading && data && viewMode === 'grafico' && (
            <div className="space-y-4">
              {/* Cards de Totais no TOPO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-[#025C3E] to-[#038451] rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-sm font-semibold mb-2 opacity-90">Total de Projetos</h3>
                  <p className="text-4xl md:text-5xl font-bold">{data.totais.quantitativo}</p>
                </div>
                
                <div className="bg-gradient-to-br from-[#025C3E] to-[#038451] rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-sm font-semibold mb-2 opacity-90">Valor Total Aprovado</h3>
                  <p className="text-3xl md:text-4xl font-bold">{data.totais.valorFormatado}</p>
                </div>
              </div>

              {/* Gráfico de Quantitativo */}
              <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
                <h3 className="text-base md:text-lg font-bold text-[#025C3E] mb-4">
                  Quantitativo de Projetos por Programa
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={chartDataQuantitativo}
                    margin={{ top: 20, right: 20, left: 10, bottom: 100 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="nome"
                      angle={-45}
                      textAnchor="end"
                      height={120}
                      interval={0}
                      tick={{ fill: "#6B7280", fontSize: 10, fontWeight: 500 }}
                    />
                    <YAxis
                      tick={{ fill: "#6B7280", fontSize: 10 }}
                      label={{
                        value: "Nº Projetos",
                        angle: -90,
                        position: "insideLeft",
                        style: { fill: "#6B7280", fontWeight: 600, fontSize: 11 },
                      }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(2, 92, 62, 0.1)" }}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "2px solid #025C3E",
                        borderRadius: "12px",
                        padding: "12px",
                      }}
                      formatter={(value: number, name: string, props: any) => [
                        `${value} projetos`,
                        props.payload.nomeCompleto,
                      ]}
                    />
                    <Bar
                      dataKey="valor"
                      radius={[8, 8, 0, 0]}
                      label={{
                        position: 'top',
                        fill: '#025C3E',
                        fontSize: 11,
                        fontWeight: 'bold',
                      }}
                    >
                      {chartDataQuantitativo.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfico de Valores */}
              <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
                <h3 className="text-base md:text-lg font-bold text-[#025C3E] mb-4">
                  Valor Aprovado por Programa
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={chartDataValor}
                    margin={{ top: 20, right: 20, left: 10, bottom: 100 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="nome"
                      angle={-45}
                      textAnchor="end"
                      height={120}
                      interval={0}
                      tick={{ fill: "#6B7280", fontSize: 10, fontWeight: 500 }}
                    />
                    <YAxis
                      tick={{ fill: "#6B7280", fontSize: 10 }}
                      tickFormatter={(value) => 
                        new Intl.NumberFormat('pt-BR', {
                          notation: 'compact',
                          compactDisplay: 'short',
                          style: 'currency',
                          currency: 'BRL'
                        }).format(value)
                      }
                      label={{
                        value: "Valor (R$)",
                        angle: -90,
                        position: "insideLeft",
                        style: { fill: "#6B7280", fontWeight: 600, fontSize: 11 },
                      }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(2, 92, 62, 0.1)" }}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "2px solid #025C3E",
                        borderRadius: "12px",
                        padding: "12px",
                      }}
                      formatter={(value: number, name: string, props: any) => [
                        new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(value),
                        props.payload.nomeCompleto,
                      ]}
                    />
                    <Bar
                      dataKey="valor"
                      radius={[8, 8, 0, 0]}
                      label={{
                        position: 'top',
                        fill: '#025C3E',
                        fontSize: 10,
                        fontWeight: 'bold',
                        formatter: (value: number) => 
                          new Intl.NumberFormat('pt-BR', {
                            notation: 'compact',
                            compactDisplay: 'short'
                          }).format(value)
                      }}
                    >
                      {chartDataValor.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Visualização Tabela */}
          {!loading && data && viewMode === 'tabela' && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#025C3E] text-white">
                      <th className="px-3 md:px-4 py-3 text-left text-xs md:text-sm font-bold">
                        Programa
                      </th>
                      <th className="px-3 md:px-4 py-3 text-center text-xs md:text-sm font-bold">
                        Quantitativo
                      </th>
                      <th className="px-3 md:px-4 py-3 text-right text-xs md:text-sm font-bold">
                        Valor Aprovado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.programas.map((programa) => (
                      <tr 
                        key={programa.id}
                        className="hover:bg-[#E3F7EF] transition-colors duration-200"
                      >
                        <td className="px-3 md:px-4 py-3 text-xs md:text-sm text-gray-800">
                          {programa.programa}
                        </td>
                        <td className="px-3 md:px-4 py-3 text-center text-xs md:text-sm font-semibold text-[#025C3E]">
                          {programa.quantitativo}
                        </td>
                        <td className="px-3 md:px-4 py-3 text-right text-xs md:text-sm font-semibold text-gray-800">
                          {programa.valorFormatado}
                        </td>
                      </tr>
                    ))}
                    
                    {/* Linha Total */}
                    <tr className="bg-[#025C3E] text-white font-bold">
                      <td className="px-3 md:px-4 py-3 text-xs md:text-sm">
                        TOTAL
                      </td>
                      <td className="px-3 md:px-4 py-3 text-center text-xs md:text-sm">
                        {data.totais.quantitativo}
                      </td>
                      <td className="px-3 md:px-4 py-3 text-right text-xs md:text-sm">
                        {data.totais.valorFormatado}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
