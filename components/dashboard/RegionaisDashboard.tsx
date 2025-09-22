'use client';

import { useEffect, useMemo, useState, useCallback, memo, useRef } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import styles from './RegionaisDashboard.module.css';

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
  nome_fazenda: string;
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

// Componente de tooltip customizado - otimizado com memo
const CustomTooltip = memo(({ active, payload }: { active?: boolean; payload?: Array<{ value: number; color: string; payload: { nome?: string; sigla_fazenda?: string; nome_fazenda?: string; totalSum: number } }> }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const value = data.value;
    let name = data.payload.nome;
    
    // Para fazendas, mostrar nome completo com sigla entre parênteses
    if (data.payload.nome_fazenda && data.payload.sigla_fazenda) {
      name = `${data.payload.nome_fazenda} (${data.payload.sigla_fazenda})`;
    } else if (data.payload.sigla_fazenda) {
      name = data.payload.sigla_fazenda;
    }
    
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
});

CustomTooltip.displayName = 'CustomTooltip';

export default function RegionaisDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [fazendasData, setFazendasData] = useState<FazendasData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para controlar apenas o hover (mantido para efeito visual suave)
  const [hoveredRegionalIndex, setHoveredRegionalIndex] = useState<number | null>(null);
  const [hoveredFazendaIndex, setHoveredFazendaIndex] = useState<number | null>(null);
  
  // Refs para timeouts de hover
  const hoverTimeoutsRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

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
      // Cleanup de timeouts de hover
      const hoverTimeouts = hoverTimeoutsRef.current;
      Object.values(hoverTimeouts).forEach(timeout => clearTimeout(timeout));
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const regionaisChartData = useMemo(() => {
    if (!data?.regionais) return [];
    
    const filtered = data.regionais.filter((r) => r.total > 0);
    if (filtered.length === 0) return [];
    
    const totalSum = filtered.reduce((acc, curr) => acc + curr.total, 0);
    return filtered.map(item => ({ ...item, totalSum }));
  }, [data?.regionais]);

  const fazendasChartData = useMemo(() => {
    if (!fazendasData?.fazendas?.length) return [];

    const filtered = fazendasData.fazendas
      .filter((f) => f.total > 0)
      .sort((a, b) => b.total - a.total);

    if (filtered.length === 0) return [];

    // Exibir todas as fazendas individualmente, sem agrupar em "Outros"
    const agrupadas: FazendaChartItem[] = filtered
      .map((f) => ({ id: f.id, sigla_fazenda: f.sigla_fazenda, nome_fazenda: f.nome_fazenda, total: f.total }));

    const totalSum = agrupadas.reduce((acc, curr) => acc + curr.total, 0);
    return agrupadas.map(item => ({ ...item, totalSum }));
  }, [fazendasData?.fazendas]);

  // Handlers apenas para os eventos de hover (efeito visual suave)
  const handleRegionalMouseEnter = useCallback((index: number) => {
    // Limpa timeout anterior se existir
    if (hoverTimeoutsRef.current.regionalEnter) {
      clearTimeout(hoverTimeoutsRef.current.regionalEnter);
    }
    
    // Debounce para hover
    const timeout = setTimeout(() => {
      setHoveredRegionalIndex(index);
    }, 50);
    hoverTimeoutsRef.current.regionalEnter = timeout;
  }, []);

  const handleRegionalMouseLeave = useCallback(() => {
    // Limpa timeout anterior se existir
    if (hoverTimeoutsRef.current.regionalLeave) {
      clearTimeout(hoverTimeoutsRef.current.regionalLeave);
    }
    
    const timeout = setTimeout(() => {
      setHoveredRegionalIndex(null);
    }, 100);
    hoverTimeoutsRef.current.regionalLeave = timeout;
  }, []);

  const handleFazendaMouseEnter = useCallback((index: number) => {
    // Limpa timeout anterior se existir
    if (hoverTimeoutsRef.current.fazendaEnter) {
      clearTimeout(hoverTimeoutsRef.current.fazendaEnter);
    }
    
    const timeout = setTimeout(() => {
      setHoveredFazendaIndex(index);
    }, 50);
    hoverTimeoutsRef.current.fazendaEnter = timeout;
  }, []);

  const handleFazendaMouseLeave = useCallback(() => {
    // Limpa timeout anterior se existir
    if (hoverTimeoutsRef.current.fazendaLeave) {
      clearTimeout(hoverTimeoutsRef.current.fazendaLeave);
    }
    
    const timeout = setTimeout(() => {
      setHoveredFazendaIndex(null);
    }, 100);
    hoverTimeoutsRef.current.fazendaLeave = timeout;
  }, []);

  // Memoização dos cards institucionais
  const institutionalCards = useMemo(() => [
    { label: 'Unidades Regionais', value: 5 },
    { label: 'Institutos Tecnológicos', value: 2 },
    { label: 'Campos Experimentais', value: 21 },
    { label: 'Total de pesquisadores', value: data?.totalGeral || 0 },
  ], [data?.totalGeral]);

  // Label de porcentagem apenas para o gráfico de "Pesquisadores por Unidade"
  const renderPercentLabel = useCallback(({ percent }: { percent?: number }) => {
    return `${((percent ?? 0) * 100).toFixed(1)}%`;
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
  <div className="space-y-1 md:space-y-2">
      {/* Cards institucionais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-1">
        {institutionalCards.map((card) => (
          <div
            key={card.label}
            className={`flex flex-col items-center justify-center rounded-xl py-6 px-4 bg-white shadow-md border border-gray-100 ${styles.institutionalCard}`}
          >
            <div className="text-3xl font-extrabold text-gray-900">{card.value}</div>
            <div className="text-base text-gray-700 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Gráficos lado a lado */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Pesquisadores por Unidade */}
        <Card className={styles.cardContainer}>
          <CardHeader className="pb-1">
            <CardTitle className="text-lg md:text-xl">Pesquisadores por Unidade</CardTitle>
            <p className="text-sm text-gray-500">Distribuição dos pesquisadores</p>
          </CardHeader>
          <CardContent className="relative py-1">
            <ResponsiveContainer width="100%" height={420} className={styles.chartContainer}>
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={regionaisChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={140}
                  paddingAngle={2}
                  labelLine={false}
                  label={renderPercentLabel}
                  fill="#8884d8"
                  dataKey="total"
                >
                  {regionaisChartData.map((_, index) => {
                    const isHovered = hoveredRegionalIndex === index;
                    
                    return (
                      <Cell 
                        key={`cell-regional-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke={isHovered ? '#333' : 'transparent'}
                        strokeWidth={isHovered ? 3 : 0}
                        className={`pieSlice ${styles.pieSlice}`}
                        style={{
                          filter: isHovered ? 'brightness(1.2)' : 'none',
                          opacity: isHovered ? 1 : 0.9,
                        }}
                      />
                    );
                  })}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-1 grid grid-cols-2 gap-1.5">
              {regionaisChartData.map((regional, index) => (
                <div 
                  key={regional.id} 
                  className="flex items-center gap-2 text-sm p-2 rounded transition-all duration-200 hover:bg-gray-50"
                  onMouseEnter={() => handleRegionalMouseEnter(index)}
                  onMouseLeave={handleRegionalMouseLeave}
                >
                  <span
                    className={`inline-block w-3 h-3 rounded-full transition-all duration-200 ${
                      hoveredRegionalIndex === index ? 'w-4 h-4' : ''
                    }`}
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-700 flex-1">
                    {regional.nome}
                  </span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {regional.total}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pesquisadores por Campo Experimental */}
        {fazendasChartData.length > 0 && (
          <Card className={styles.cardContainer}>
            <CardHeader className="pb-1">
              <CardTitle className="text-lg md:text-xl">Pesquisadores por Campo Experimental</CardTitle>
              <p className="text-sm text-gray-500">Distribuição dos pesquisadores</p>
            </CardHeader>
            <CardContent className="relative py-1">
              <ResponsiveContainer width="100%" height={420} className={styles.chartContainer}>
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Pie
                    data={fazendasChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={140}
                    paddingAngle={2}
                    labelLine={false}
                    fill="#8884d8"
                    dataKey="total"
                  >
                    {fazendasChartData.map((_, index) => {
                      const isHovered = hoveredFazendaIndex === index;
                      
                      return (
                        <Cell 
                          key={`cell-fazenda-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke={isHovered ? '#333' : 'transparent'}
                          strokeWidth={isHovered ? 3 : 0}
                          className={`pieSlice ${styles.pieSlice}`}
                          style={{
                            filter: isHovered ? 'brightness(1.2)' : 'none',
                            opacity: isHovered ? 1 : 0.9,
                          }}
                        />
                      );
                    })}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-1 space-y-1.5">
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Distribuição por Campo Experimental</h4>
                <div className="grid grid-cols-2 gap-4">
                  {fazendasChartData
                    .sort((a, b) => b.total - a.total) // Ordenar em ordem decrescente
                    .map((fazenda, index) => {
                      // Largura baseada no percentual do total geral
                      const totalSum = fazenda.totalSum || fazendasChartData.reduce((acc, f) => acc + f.total, 0);
                      const percent = totalSum > 0 ? (fazenda.total / totalSum) : 0;
                      const barWidth = percent * 100; // em % do contêiner
                      const originalIndex = fazendasChartData.findIndex(f => f.id === fazenda.id && f.sigla_fazenda === fazenda.sigla_fazenda);
                      
                      return (
                        <div 
                          key={`${fazenda.id}-${fazenda.sigla_fazenda}-${index}`} 
                          className="space-y-2"
                          onMouseEnter={() => handleFazendaMouseEnter(originalIndex)}
                          onMouseLeave={handleFazendaMouseLeave}
                        >
                          {/* Linha com nome */}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-block w-3 h-3 rounded-full transition-all duration-200 ${
                                  hoveredFazendaIndex === originalIndex ? 'w-4 h-4' : ''
                                }`}
                                style={{ backgroundColor: COLORS[originalIndex % COLORS.length] }}
                              />
                              <span className="text-gray-700 font-medium text-xs truncate" title={`${fazenda.nome_fazenda} (${fazenda.sigla_fazenda})`}>
                                {fazenda.nome_fazenda} ({fazenda.sigla_fazenda})
                              </span>
                            </div>
                          </div>
                          
                          {/* Barra de progresso com rótulo no final */}
                          <div className="w-full bg-gray-200 rounded-lg h-7 overflow-hidden relative">
                            {/* Preenchimento da barra */}
                            <div 
                              className={`h-full rounded-lg transition-all duration-300 relative ${
                                hoveredFazendaIndex === originalIndex ? 'brightness-110' : ''
                              }`}
                              style={{ 
                                width: `${barWidth}%`,
                                backgroundColor: COLORS[originalIndex % COLORS.length],
                                boxShadow: hoveredFazendaIndex === originalIndex ? '0 0 8px rgba(0,0,0,0.3)' : 'none',
                                minWidth: barWidth > 0 ? '24px' : '0' // mínima pequena para visibilidade
                              }}
                            />
                            {/* Rótulo fixo no final da barra de progresso */}
                            <div className="absolute inset-y-0 right-2 pointer-events-none flex items-center">
                              <span className="text-gray-800 font-semibold text-xs whitespace-nowrap">
                                {fazenda.total} ({(percent * 100).toFixed(1)}%)
                              </span>
                              <span
                                className="ml-1 inline-block w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: COLORS[originalIndex % COLORS.length] }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}