'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RegionalData {
  id: number;
  nome: string;
  total: number;
}

interface FazendaData {
  id: number;
  nome_fazenda: string;
  sigla_fazenda: string;
  nome_regional: string;
  total: number;
}

interface DashboardData {
  success: boolean;
  regionais: RegionalData[];
  totalGeral: number;
  error?: string;
}

interface FazendasData {
  success: boolean;
  fazendas: FazendaData[];
  totalGeral: number;
  error?: string;
}

type FazendaChartItem = {
  id: number;
  sigla_fazenda: string;
  total: number;
};

const COLORS = [
  '#A15CE0',
  '#5FADE0',
  '#7FC86E',
  '#5F5FE0',
  '#E0C85F',
  '#7FCFE6',
  '#E07A5F',
  '#A15C8F',
  '#E0A85F',
  '#5F8F5F',
  '#7FE07F',
  '#C85FA1',
  '#7FE05F',
  '#5FE0E0',
];

// Componente de tooltip customizado
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const value = data.value;
    const name = data.payload.nome || data.payload.sigla_fazenda;
    const percent = ((value / data.payload.totalSum) * 100).toFixed(1);
    
    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3 max-w-xs">
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: data.color }}
          />
          <span className="font-semibold text-gray-800">{name}</span>
        </div>
        <div className="text-sm text-gray-600">
          <div>Pesquisadores: <span className="font-bold text-gray-800">{value}</span></div>
          <div>Percentual: <span className="font-bold text-gray-800">{percent}%</span></div>
        </div>
      </div>
    );
  }
  return null;
};

export default function RegionaisDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [fazendasData, setFazendasData] = useState<FazendasData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para controlar as fatias "puxadas"
  const [activeRegionalIndex, setActiveRegionalIndex] = useState<number | null>(null);
  const [activeFazendaIndex, setActiveFazendaIndex] = useState<number | null>(null);
  const [hoveredRegionalIndex, setHoveredRegionalIndex] = useState<number | null>(null);
  const [hoveredFazendaIndex, setHoveredFazendaIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const [regionaisResponse, fazendasResponse] = await Promise.all([
          fetch('/api/dashboard/regionais'),
          fetch('/api/dashboard/fazendas'),
        ]);

        if (!regionaisResponse.ok) {
          throw new Error('Falha ao carregar dados das regionais');
        }
        if (!fazendasResponse.ok) {
          console.warn('Falha ao carregar dados das fazendas');
        }

        const regionaisResult: DashboardData = await regionaisResponse.json();
        const fazendasResult: FazendasData = await fazendasResponse.json().catch(() => ({
          success: false,
          fazendas: [],
          totalGeral: 0,
          error: 'Falha ao parsear dados das fazendas',
        }));

        if (!cancelled) {
          if (regionaisResult.success) {
            setData(regionaisResult);
          } else {
            setError(regionaisResult.error || 'Erro ao carregar dados das regionais');
          }

          if (fazendasResult.success) {
            setFazendasData(fazendasResult);
          } else {
            console.warn('Erro ao carregar dados das fazendas:', fazendasResult.error);
            setFazendasData({ success: false, fazendas: [], totalGeral: 0, error: fazendasResult.error });
          }
        }
      } catch (e: unknown) {
        if (!cancelled) {
          const message = e instanceof Error ? e.message : 'Erro de conexão com o servidor';
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  const regionaisChartData = useMemo(() => {
    const filtered = data?.regionais.filter((r) => r.total > 0) ?? [];
    const totalSum = filtered.reduce((acc, curr) => acc + curr.total, 0);
    return filtered.map(item => ({ ...item, totalSum }));
  }, [data]);

  const fazendasChartData = useMemo(() => {
    if (!fazendasData?.fazendas?.length) return [];

    const filtered = [...fazendasData.fazendas]
      .filter((f) => f.total > 0)
      .sort((a, b) => b.total - a.total);

    const outrosSum = filtered
      .filter((f) => f.total < 2)
      .reduce((acc, curr) => acc + curr.total, 0);

    const agrupadas: FazendaChartItem[] = filtered
      .filter((f) => f.total >= 2)
      .map((f) => ({ id: f.id, sigla_fazenda: f.sigla_fazenda, total: f.total }));

    if (outrosSum > 0) {
      agrupadas.push({ id: -1, sigla_fazenda: 'Outros', total: outrosSum });
    }

    const totalSum = agrupadas.reduce((acc, curr) => acc + curr.total, 0);
    return agrupadas.map(item => ({ ...item, totalSum }));
  }, [fazendasData]);

  // Handlers para os eventos de clique e hover
  const handleRegionalClick = useCallback((index: number) => {
    setActiveRegionalIndex(prev => prev === index ? null : index);
  }, []);

  const handleFazendaClick = useCallback((index: number) => {
    setActiveFazendaIndex(prev => prev === index ? null : index);
  }, []);

  const handleRegionalMouseEnter = useCallback((index: number) => {
    setHoveredRegionalIndex(index);
  }, []);

  const handleRegionalMouseLeave = useCallback(() => {
    setHoveredRegionalIndex(null);
  }, []);

  const handleFazendaMouseEnter = useCallback((index: number) => {
    setHoveredFazendaIndex(index);
  }, []);

  const handleFazendaMouseLeave = useCallback(() => {
    setHoveredFazendaIndex(null);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gray-200 rounded" />
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gray-200 rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-red-600 text-center">
            <p className="font-semibold">Erro ao carregar dashboard</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.regionais.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Nenhum dado encontrado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Cards institucionais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        {[
          { label: 'Unidades Regionais', value: 5 },
          { label: 'Institutos Tecnológicos', value: 2 },
          { label: 'Campos Experimentais', value: 21 },
          { label: 'Total de pesquisadores', value: data?.totalGeral || 0 },
        ].map((card) => (
          <div
            key={card.label}
            className="flex flex-col items-center justify-center rounded-xl py-6 px-4 bg-white shadow-md border border-gray-100"
          >
            <div className="text-3xl font-extrabold text-gray-900">{card.value}</div>
            <div className="text-base text-gray-700 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Gráficos lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pesquisadores por Unidade */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl">Pesquisadores por Unidade</CardTitle>
            <p className="text-sm text-gray-500">Clique nas fatias para destacar</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={380}>
              <PieChart>
                <Pie
                  data={regionaisChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={activeRegionalIndex !== null ? 115 : 110}
                  paddingAngle={2}
                  labelLine={false}
                  label={({ percent }) => `${(((percent ?? 0) as number) * 100).toFixed(1)}%`}
                  fill="#8884d8"
                  dataKey="total"
                  onClick={(_, index) => handleRegionalClick(index)}
                  style={{ cursor: 'pointer' }}
                >
                  {regionaisChartData.map((_, index) => {
                    const isActive = activeRegionalIndex === index;
                    const isHovered = hoveredRegionalIndex === index;
                    
                    return (
                      <Cell 
                        key={`cell-regional-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke={isHovered || isActive ? '#333' : 'transparent'}
                        strokeWidth={isHovered || isActive ? 2 : 0}
                        style={{
                          filter: isHovered ? 'brightness(1.15)' : isActive ? 'brightness(1.1)' : 'none',
                          opacity: isHovered || isActive ? 1 : 0.9,
                        }}
                      />
                    );
                  })}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {regionaisChartData.map((regional, index) => (
                <div 
                  key={regional.id} 
                  className={`flex items-center gap-2 text-sm cursor-pointer p-2 rounded transition-all duration-200 ${
                    activeRegionalIndex === index ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleRegionalClick(index)}
                  onMouseEnter={() => handleRegionalMouseEnter(index)}
                  onMouseLeave={handleRegionalMouseLeave}
                >
                  <span
                    className={`inline-block w-3 h-3 rounded-full transition-all duration-200 ${
                      hoveredRegionalIndex === index || activeRegionalIndex === index ? 'w-4 h-4' : ''
                    }`}
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className={`text-gray-700 ${activeRegionalIndex === index ? 'font-semibold' : ''}`}>
                    {regional.nome}
                  </span>
                  {(activeRegionalIndex === index || hoveredRegionalIndex === index) && (
                    <span className="ml-auto text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {regional.total}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pesquisadores por Campo Experimental */}
        {fazendasChartData.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg md:text-xl">Pesquisadores por Campo Experimental</CardTitle>
              <p className="text-sm text-gray-500">Clique nas fatias para destacar</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={380}>
                <PieChart>
                  <Pie
                    data={fazendasChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={activeFazendaIndex !== null ? 115 : 110}
                    paddingAngle={2}
                    labelLine={false}
                    label={({ percent }) => `${(((percent ?? 0) as number) * 100).toFixed(1)}%`}
                    fill="#8884d8"
                    dataKey="total"
                    onClick={(_, index) => handleFazendaClick(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    {fazendasChartData.map((_, index) => {
                      const isActive = activeFazendaIndex === index;
                      const isHovered = hoveredFazendaIndex === index;
                      
                      return (
                        <Cell 
                          key={`cell-fazenda-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke={isHovered || isActive ? '#333' : 'transparent'}
                          strokeWidth={isHovered || isActive ? 2 : 0}
                          style={{
                            filter: isHovered ? 'brightness(1.15)' : isActive ? 'brightness(1.1)' : 'none',
                            opacity: isHovered || isActive ? 1 : 0.9,
                          }}
                        />
                      );
                    })}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {fazendasChartData.map((fazenda, index) => (
                  <div 
                    key={`${fazenda.id}-${fazenda.sigla_fazenda}-${index}`} 
                    className={`flex items-center gap-2 text-sm cursor-pointer p-2 rounded transition-all duration-200 ${
                      activeFazendaIndex === index ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleFazendaClick(index)}
                    onMouseEnter={() => handleFazendaMouseEnter(index)}
                    onMouseLeave={handleFazendaMouseLeave}
                  >
                    <span
                      className={`inline-block w-3 h-3 rounded-full transition-all duration-200 ${
                        hoveredFazendaIndex === index || activeFazendaIndex === index ? 'w-4 h-4' : ''
                      }`}
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className={`text-gray-700 truncate ${activeFazendaIndex === index ? 'font-semibold' : ''}`}>
                      {fazenda.sigla_fazenda}
                    </span>
                    {(activeFazendaIndex === index || hoveredFazendaIndex === index) && (
                      <span className="ml-auto text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {fazenda.total}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}