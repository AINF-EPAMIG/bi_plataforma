"use client";

import { useState, useEffect } from "react";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import GroupIcon from '@mui/icons-material/Group';

import RegionaisChart from '@/components/dashboard/RegionaisChart';
import FazendasChart from '@/components/dashboard/FazendasChart';
import Header from '@/components/header';
import AppSidebar from '../../components/AppSidebar';

interface DashboardStats {
  regionais: number;
  institutos: number;
  fazendas: number;
  pesquisadores: number;
}

export default function Page() {
  const [stats, setStats] = useState<DashboardStats>({
    regionais: 0,
    institutos: 0,
    fazendas: 0,
    pesquisadores: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<'regionais' | 'fazendas'>('regionais');

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
      <AppSidebar />
      {/* HEADER FIXO + Main */}
      <div className="flex-1 pl-20 md:pl-64 flex flex-col">
        {/* Shared Header */}
        <Header />
        <main className="p-4 md:p-6 lg:p-8 w-full max-w-[1400px] mx-auto">
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 mb-5 md:mb-6">
            {/* Card Unidades Regionais */}
            <div className="bg-white rounded-xl shadow-md p-3 md:p-4 border border-[#E2E8EA] hover:shadow-lg transition-all min-h-[110px] md:min-h-[120px] flex flex-col justify-between">
              <div className="flex items-start justify-between mb-2">
                <div className="bg-[#E3F7EF] p-2 md:p-2.5 rounded-lg">
                  <LocationOnIcon className="text-[#025C3E]" fontSize="small" />
                </div>
                {loading && <div className="animate-pulse bg-gray-200 h-6 w-12 rounded" />}
              </div>
              <h3 className="text-[11px] md:text-xs font-semibold tracking-wide text-gray-600 mb-1">Unidades Regionais</h3>
              {!loading && <p className="text-xl md:text-2xl font-bold text-black leading-tight">{stats.regionais}</p>}
            </div>
            {/* Card Institutos Tecnológicos */}
            <div className="bg-white rounded-xl shadow-md p-3 md:p-4 border border-[#E2E8EA] hover:shadow-lg transition-all min-h-[110px] md:min-h-[120px] flex flex-col justify-between">
              <div className="flex items-start justify-between mb-2">
                <div className="bg-[#E3F7EF] p-2 md:p-2.5 rounded-lg">
                  <BusinessIcon className="text-[#025C3E]" fontSize="small" />
                </div>
                {loading && <div className="animate-pulse bg-gray-200 h-6 w-12 rounded" />}
              </div>
              <h3 className="text-[11px] md:text-xs font-semibold tracking-wide text-gray-600 mb-1">Institutos Tecnológicos</h3>
              {!loading && <p className="text-xl md:text-2xl font-bold text-black leading-tight">{stats.institutos}</p>}
            </div>
            {/* Card Campos Experimentais */}
            <div className="bg-white rounded-xl shadow-md p-3 md:p-4 border border-[#E2E8EA] hover:shadow-lg transition-all min-h-[110px] md:min-h-[120px] flex flex-col justify-between">
              <div className="flex items-start justify-between mb-2">
                <div className="bg-[#E3F7EF] p-2 md:p-2.5 rounded-lg">
                  <AgricultureIcon className="text-[#025C3E]" fontSize="small" />
                </div>
                {loading && <div className="animate-pulse bg-gray-200 h-6 w-12 rounded" />}
              </div>
              <h3 className="text-[11px] md:text-xs font-semibold tracking-wide text-gray-600 mb-1">Campos Experimentais</h3>
              {!loading && <p className="text-xl md:text-2xl font-bold text-black leading-tight">{stats.fazendas}</p>}
            </div>
            {/* Card Total de Pesquisadores */}
            <div className="bg-white rounded-xl shadow-md p-3 md:p-4 border border-[#E2E8EA] hover:shadow-lg transition-all min-h-[110px] md:min-h-[120px] flex flex-col justify-between">
              <div className="flex items-start justify-between mb-2">
                <div className="bg-[#E3F7EF] p-2 md:p-2.5 rounded-lg">
                  <GroupIcon className="text-[#025C3E]" fontSize="small" />
                </div>
                {loading && <div className="animate-pulse bg-gray-200 h-6 w-12 rounded" />}
              </div>
              <h3 className="text-[11px] md:text-xs font-semibold tracking-wide text-gray-600 mb-1">Pesquisadores e Assessores Ativos</h3>
              {!loading && <p className="text-xl md:text-2xl font-bold text-black leading-tight">{stats.pesquisadores}</p>}
            </div>
          </div>

          {/* Navegação entre Gráficos */}
          <div className="mb-5">
            <div className="flex gap-2 md:gap-3 justify-center md:justify-start flex-wrap">
              <button
                onClick={() => setActiveChart('regionais')}
                className={`px-3 md:px-4 py-2 rounded-lg font-semibold text-xs md:text-sm transition-all flex items-center gap-1.5 tracking-wide
                ${activeChart === 'regionais' ? 'bg-[#025C3E] text-white shadow-md' : 'bg-white text-[#025C3E] border border-[#025C3E] hover:bg-[#E3F7EF]'}`}
              >
                <LocationOnIcon fontSize="small" />
                <span>Unidades Regionais</span>
              </button>
              <button
                onClick={() => setActiveChart('fazendas')}
                className={`px-3 md:px-4 py-2 rounded-lg font-semibold text-xs md:text-sm transition-all flex items-center gap-1.5 tracking-wide
                ${activeChart === 'fazendas' ? 'bg-[#025C3E] text-white shadow-md' : 'bg-white text-[#025C3E] border border-[#025C3E] hover:bg-[#E3F7EF]'}`}
              >
                <AgricultureIcon fontSize="small" />
                <span>Campos Experimentais</span>
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
