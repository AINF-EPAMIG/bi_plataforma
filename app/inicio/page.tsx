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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import GroupIcon from '@mui/icons-material/Group';
import PeopleIcon from '@mui/icons-material/People';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import RegionaisChart from '@/components/dashboard/RegionaisChart';
import FazendasChart from '@/components/dashboard/FazendasChart';
import Image from 'next/image';

const menuItems = [
  {
    label: "Projetos",
    icon: <AssignmentIcon fontSize="small" className="text-[#025C3E]" />,
    sub: [
      { label: "Visão Geral", href: "/projetos/financeiro" },
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

interface DashboardStats {
  regionais: number;
  institutos: number;
  fazendas: number;
  pesquisadores: number;
}

export default function Page() {
  const [openMenu, setOpenMenu] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    regionais: 0,
    institutos: 0,
    fazendas: 0,
    pesquisadores: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<'regionais' | 'fazendas'>('regionais');

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
    async function fetchStats() {
      try {
        setLoading(true);
        // Buscar apenas regionais (os demais valores são fixos)
        const regionaisRes = await fetch('/api/dashboard/regionais');
        const regionaisData = await regionaisRes.json();
        setStats({
          regionais: 5,
          institutos: 2,
          fazendas: 21,
          pesquisadores: regionaisData.totalGeral || 0,
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f6f8f9] overflow-x-hidden">
      {/* Menu Lateral */}
      <aside className="bg-white border-r-8 border-[#025C3E] w-20 md:w-64 h-screen flex flex-col items-center py-8 fixed left-0 top-0 z-40 shadow-lg overflow-y-auto">
        <div className="flex flex-col items-center w-full">
          <Image src="/epamig.svg" alt="Logo EPAMIG" width={112} height={112} className="w-28 h-28 mb-3" priority />
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
                    <span className="text-[#025C3E] text-base md:text-lg font-semibold">{item.label}</span>
                  </div>
                  <span
                    className={`text-[#025C3E] transform transition-transform duration-300 ${
                      openMenu === idx ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <svg width={20} height={20}><path d="M7 10l5 0" stroke="#025C3E" strokeWidth={3} strokeLinecap="round" /></svg>
                  </span>
                </button>
                {openMenu === idx && (
                  <div className="absolute left-full top-0 md:static md:left-0 md:top-auto z-20 w-32 md:w-auto shadow-lg rounded-xl bg-white mt-2 animate-fadein border border-[#E3F7EF]">
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
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Card Unidades Regionais */}
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border-l-4 border-[#025C3E] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-[#E3F7EF] p-3 rounded-xl">
                  <LocationOnIcon className="text-[#025C3E]" fontSize="large" />
                </div>
                {loading && (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                )}
              </div>
              <h3 className="text-gray-600 text-xs md:text-sm font-semibold mb-3">Unidades Regionais</h3>
              {!loading && (
                <p className="text-3xl md:text-4xl font-bold text-black">{stats.regionais}</p>
              )}
            </div>

            {/* Card Institutos Tecnológicos */}
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border-l-4 border-[#025C3E] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-[#E3F7EF] p-3 rounded-xl">
                  <BusinessIcon className="text-[#025C3E]" fontSize="large" />
                </div>
                {loading && (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                )}
              </div>
              <h3 className="text-gray-600 text-xs md:text-sm font-semibold mb-3">Institutos Tecnológicos</h3>
              {!loading && (
                <p className="text-3xl md:text-4xl font-bold text-black">{stats.institutos}</p>
              )}
            </div>

            {/* Card Campos Experimentais */}
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border-l-4 border-[#025C3E] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-[#E3F7EF] p-3 rounded-xl">
                  <AgricultureIcon className="text-[#025C3E]" fontSize="large" />
                </div>
                {loading && (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                )}
              </div>
              <h3 className="text-gray-600 text-xs md:text-sm font-semibold mb-3">Campos Experimentais</h3>
              {!loading && (
                <p className="text-3xl md:text-4xl font-bold text-black">{stats.fazendas}</p>
              )}
            </div>

            {/* Card Total de Pesquisadores */}
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border-l-4 border-[#025C3E] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-[#E3F7EF] p-3 rounded-xl">
                  <GroupIcon className="text-[#025C3E]" fontSize="large" />
                </div>
                {loading && (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                )}
              </div>
              <h3 className="text-gray-600 text-xs md:text-sm font-semibold mb-3">Total de Pesquisadores e Assessores Ativos</h3>
              {!loading && (
                <p className="text-3xl md:text-4xl font-bold text-black">{stats.pesquisadores}</p>
              )}
            </div>
          </div>

          {/* Navegação entre Gráficos */}
          <div className="mb-6">
            <div className="flex gap-3 justify-center md:justify-start flex-wrap">
              <button
                onClick={() => setActiveChart('regionais')}
                className={`
                  px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base
                  transition-all duration-300 flex items-center gap-2
                  ${activeChart === 'regionais' 
                    ? 'bg-[#025C3E] text-white shadow-lg scale-105' 
                    : 'bg-white text-[#025C3E] border-2 border-[#025C3E] hover:bg-[#E3F7EF]'
                  }
                `}
              >
                <LocationOnIcon fontSize="small" />
                <span>Pesquisadores por Unidade Regional</span>
              </button>
              
              <button
                onClick={() => setActiveChart('fazendas')}
                className={`
                  px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base
                  transition-all duration-300 flex items-center gap-2
                  ${activeChart === 'fazendas' 
                    ? 'bg-[#025C3E] text-white shadow-lg scale-105' 
                    : 'bg-white text-[#025C3E] border-2 border-[#025C3E] hover:bg-[#E3F7EF]'
                  }
                `}
              >
                <AgricultureIcon fontSize="small" />
                <span>Pesquisadores por Campo Experimental</span>
              </button>
            </div>
          </div>

          {/* Gráficos alternados */}
          {activeChart === 'regionais' ? <RegionaisChart /> : <FazendasChart />}
        </main>
      </div>
    </div>
  );
}
