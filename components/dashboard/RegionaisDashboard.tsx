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

// Componente de caixinha de informações com animação - otimizado com memo
const InfoBox = memo(({ 
  item, 
  isVisible, 
  onClose, 
  total, 
  color, 
  isAnimating 
}: { 
  item: RegionalData | FazendaChartItem; 
  isVisible: boolean; 
  onClose: () => void; 
  total: number; 
  color: string;
  isAnimating: boolean;
}) => {
  if (!isVisible) return null;

  const name = 'nome' in item ? item.nome : item.sigla_fazenda;
  const percent = ((item.total / total) * 100).toFixed(1);

  return (
    <div 
      className={`absolute top-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-xl p-4 min-w-64 transform transition-all duration-300 ${styles.infoBox} ${
        isAnimating ? 'scale-110' : 'scale-100'
      } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: color }}
          />
          <span className="font-bold text-gray-800 text-lg">{name}</span>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center py-2 px-3 bg-blue-50 rounded">
          <span className="text-gray-700 font-medium">Pesquisadores:</span>
          <span className="font-bold text-blue-600 text-xl">{item.total}</span>
        </div>
        
        <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded">
          <span className="text-gray-700 font-medium">Percentual:</span>
          <span className="font-bold text-green-600 text-xl">{percent}%</span>
        </div>
        
        {'nome' in item ? (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <span className="text-sm text-gray-500">Unidade Regional</span>
          </div>
        ) : (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <span className="text-sm text-gray-500">Campo Experimental</span>
          </div>
        )}
      </div>
    </div>
  );
});

InfoBox.displayName = 'InfoBox';

// Componente de tooltip customizado - otimizado com memo
const CustomTooltip = memo(({ active, payload }: { active?: boolean; payload?: Array<{ value: number; color: string; payload: { nome?: string; sigla_fazenda?: string; totalSum: number } }> }) => {
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
});

CustomTooltip.displayName = 'CustomTooltip';

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
  
  // Estados para controlar as caixinhas de informações
  const [showRegionalInfo, setShowRegionalInfo] = useState<number | null>(null);
  const [showFazendaInfo, setShowFazendaInfo] = useState<number | null>(null);
  const [animatingRegional, setAnimatingRegional] = useState<number | null>(null);
  const [animatingFazenda, setAnimatingFazenda] = useState<number | null>(null);
  
  // Refs para timeouts (não causam re-renders)
  const animationTimeoutsRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
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
      // Cleanup de todos os timeouts
      const animationTimeouts = animationTimeoutsRef.current;
      const hoverTimeouts = hoverTimeoutsRef.current;
      Object.values(animationTimeouts).forEach(timeout => clearTimeout(timeout));
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
  }, [fazendasData?.fazendas]);

  // Handlers para os eventos de clique e hover - simplificados
  const handleRegionalClick = useCallback((index: number) => {
    // Limpa timeout anterior se existir
    if (animationTimeoutsRef.current.regional) {
      clearTimeout(animationTimeoutsRef.current.regional);
    }
    
    // Animação de clique
    setAnimatingRegional(index);
    const timeout = setTimeout(() => setAnimatingRegional(null), 300);
    animationTimeoutsRef.current.regional = timeout;
    
    // Controle da fatia ativa
    setActiveRegionalIndex(prev => prev === index ? null : index);
    
    // Controle da caixinha de informações
    setShowRegionalInfo(prev => {
      if (prev === index) {
        return null; // Fecha se já estava aberta
      } else {
        return index; // Abre na nova posição
      }
    });
  }, []);

  const handleFazendaClick = useCallback((index: number) => {
    // Limpa timeout anterior se existir
    if (animationTimeoutsRef.current.fazenda) {
      clearTimeout(animationTimeoutsRef.current.fazenda);
    }
    
    // Animação de clique
    setAnimatingFazenda(index);
    const timeout = setTimeout(() => setAnimatingFazenda(null), 300);
    animationTimeoutsRef.current.fazenda = timeout;
    
    // Controle da fatia ativa
    setActiveFazendaIndex(prev => prev === index ? null : index);
    
    // Controle da caixinha de informações
    setShowFazendaInfo(prev => {
      if (prev === index) {
        return null; // Fecha se já estava aberta
      } else {
        return index; // Abre na nova posição
      }
    });
  }, []);

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

  // Função de label estável para porcentagens
  const renderLabel = useCallback(({ percent }: { percent?: number }) => {
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
    <div className="space-y-4 md:space-y-6">
      {/* Cards institucionais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pesquisadores por Unidade */}
        <Card className={styles.cardContainer}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl">Pesquisadores por Unidade</CardTitle>
            <p className="text-sm text-gray-500">Clique nas fatias para destacar</p>
          </CardHeader>
          <CardContent className="relative">
            {/* Caixinha de informações para regionais */}
            {showRegionalInfo !== null && regionaisChartData[showRegionalInfo] && (
              <InfoBox
                item={regionaisChartData[showRegionalInfo]}
                isVisible={showRegionalInfo !== null}
                onClose={() => setShowRegionalInfo(null)}
                total={data?.totalGeral || 0}
                color={COLORS[showRegionalInfo % COLORS.length]}
                isAnimating={animatingRegional === showRegionalInfo}
              />
            )}
            
            <ResponsiveContainer width="100%" height={380} className={styles.chartContainer}>
              <PieChart>
                <Pie
                  data={regionaisChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                  labelLine={false}
                  label={renderLabel}
                  fill="#8884d8"
                  dataKey="total"
                  onClick={(event: unknown, index: number) => handleRegionalClick(index)}
                  style={{ cursor: 'pointer' }}
                >
                  {regionaisChartData.map((_, index) => {
                    const isActive = activeRegionalIndex === index;
                    const isHovered = hoveredRegionalIndex === index;
                    const isAnimating = animatingRegional === index;
                    
                    return (
                      <Cell 
                        key={`cell-regional-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke={isHovered || isActive ? '#333' : 'transparent'}
                        strokeWidth={isHovered || isActive ? 3 : 0}
                        className={`pieSlice ${styles.pieSlice}`}
                        style={{
                          filter: isHovered ? 'brightness(1.2)' : isActive ? 'brightness(1.15)' : isAnimating ? 'brightness(1.3)' : 'none',
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
          <Card className={styles.cardContainer}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg md:text-xl">Pesquisadores por Campo Experimental</CardTitle>
              <p className="text-sm text-gray-500">Clique nas fatias para destacar</p>
            </CardHeader>
            <CardContent className="relative">
              {/* Caixinha de informações para fazendas */}
              {showFazendaInfo !== null && fazendasChartData[showFazendaInfo] && (
                <InfoBox
                  item={fazendasChartData[showFazendaInfo]}
                  isVisible={showFazendaInfo !== null}
                  onClose={() => setShowFazendaInfo(null)}
                  total={fazendasData?.totalGeral || 0}
                  color={COLORS[showFazendaInfo % COLORS.length]}
                  isAnimating={animatingFazenda === showFazendaInfo}
                />
              )}
              
              <ResponsiveContainer width="100%" height={380} className={styles.chartContainer}>
                <PieChart>
                  <Pie
                    data={fazendasChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    labelLine={false}
                    label={renderLabel}
                    fill="#8884d8"
                    dataKey="total"
                    onClick={(event: unknown, index: number) => handleFazendaClick(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    {fazendasChartData.map((_, index) => {
                      const isActive = activeFazendaIndex === index;
                      const isHovered = hoveredFazendaIndex === index;
                      const isAnimating = animatingFazenda === index;
                      
                      return (
                        <Cell 
                          key={`cell-fazenda-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke={isHovered || isActive ? '#333' : 'transparent'}
                          strokeWidth={isHovered || isActive ? 3 : 0}
                          className={`pieSlice ${styles.pieSlice}`}
                          style={{
                            filter: isHovered ? 'brightness(1.2)' : isActive ? 'brightness(1.15)' : isAnimating ? 'brightness(1.3)' : 'none',
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