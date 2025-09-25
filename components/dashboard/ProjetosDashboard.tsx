'use client';

import { useEffect, useState, useCallback, useRef, memo, useMemo, Suspense } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, FilterIcon, DownloadIcon, MapPin } from 'lucide-react';

interface ProgramaData {
  id: number;
  nome: string;
  valores_por_ano: { [ano: string]: number };
  projetos_por_ano: { [ano: string]: number };
  valor_total: number;
  total_projetos: number;
}

interface ProjetosData {
  success: boolean;
  programas: ProgramaData[];
  anos: number[];
  totais_gerais: {
    valores_por_ano: { [ano: string]: number };
    projetos_por_ano: { [ano: string]: number };
    valor_total_geral: number;
    total_projetos_geral: number;
    valor_ano_vigente: number;
    projetos_ano_vigente: number;
  };
  ano_vigente: number;
  error?: string;
}

// Alias para manter compatibilidade - removido

const COLORS = [
  '#A15CE0', '#5FADE0', '#7FC86E', '#5F5FE0', '#E0C85F', '#7FCFE6',
  '#E07A5F', '#A15C8F', '#E0A85F', '#5F8F5F', '#7FE07F', '#C85FA1', '#7FE05F', '#5FE0E0',
];

// Optimize label rendering - memoized
const renderLabel = memo((entry: { percent: number }) => 
  `${(entry.percent * 100).toFixed(1)}%`
);
renderLabel.displayName = 'RenderLabel';

// Optimized InfoBox component with better performance
const InfoBox = memo(function InfoBox({ item, isVisible, onClose, color, isAnimating, tipo }: {
  item: { nome?: string; value: number; totalSum: number };
  isVisible: boolean;
  onClose: () => void;
  color: string;
  isAnimating: boolean;
  tipo: 'quantitativo' | 'financeiro';
}) {
  if (!isVisible || !item) return null;

  // Move useMemo hooks before early return
  const percent = ((item.value / item.totalSum) * 100).toFixed(1);
  const valorFormatado = tipo === 'financeiro' 
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value)
    : item.value.toString();

  return (
    <div className={`fixed top-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-xs transition-all duration-300 ${isAnimating ? 'scale-105' : ''}`}>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Fechar"
      >
        ✕
      </button>
      
      <div className="flex items-center gap-3 mb-3">
        <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <h3 className="font-bold text-gray-800 text-lg leading-tight">{item.nome}</h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center py-2 px-3 bg-blue-50 rounded">
          <span className="text-gray-700 font-medium">
            {tipo === 'financeiro' ? 'Valor:' : 'Projetos:'}
          </span>
          <span className="font-bold text-blue-600 text-xl">{valorFormatado}</span>
        </div>
        
        <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded">
          <span className="text-gray-700 font-medium">Percentual:</span>
          <span className="font-bold text-green-600 text-xl">{percent}%</span>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-200">
          <span className="text-sm text-gray-500">Programa de Pesquisa</span>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.isVisible === nextProps.isVisible &&
    prevProps.isAnimating === nextProps.isAnimating &&
    prevProps.item?.value === nextProps.item?.value &&
    prevProps.color === nextProps.color
  );
});

InfoBox.displayName = 'InfoBox';

// Optimized CustomTooltip component
const CustomTooltip = memo(function CustomTooltip({ active, payload, tipo }: { 
  active?: boolean; 
  payload?: Array<{ value: number; color: string; payload: { name?: string; totalSum: number } }>; 
  tipo: 'quantitativo' | 'financeiro';
}) {
  if (!active || !payload?.length) return null;

  const data = payload[0];
  const { value, color } = data;
  const { name, totalSum } = data.payload;
  
  const percent = ((value / totalSum) * 100).toFixed(1);
  const valorFormatado = tipo === 'financeiro' 
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    : value.toString();
  
  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3 max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-semibold text-gray-800">{name}</span>
      </div>
      <div className="text-sm text-gray-600">
        <div>{tipo === 'financeiro' ? 'Valor:' : 'Projetos:'} <span className="font-bold text-gray-800">{valorFormatado}</span></div>
        <div>Percentual: <span className="font-bold text-gray-800">{percent}%</span></div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.active === nextProps.active && 
         prevProps.payload?.[0]?.value === nextProps.payload?.[0]?.value;
});

// Memoized Chart Component for better performance
const MemoizedPieChart = memo(function MemoizedPieChart({ 
  data, 
  onSliceClick, 
  activeIndex, 
  hoveredIndex, 
  animatingIndex, 
  tipo 
}: {
  data: Array<{ name: string; value: number; color: string; totalSum: number }>;
  onSliceClick: (index: number) => void;
  activeIndex: number | null;
  hoveredIndex: number | null;
  animatingIndex: number | null;
  tipo: 'quantitativo' | 'financeiro';
}) {
  return (
    <ResponsiveContainer width="100%" height={380}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={2}
          labelLine={false}
          label={renderLabel}
          fill="#8884d8"
          dataKey="value"
          onClick={(event: unknown, index: number) => onSliceClick(index)}
          style={{ cursor: 'pointer' }}
        >
          {data.map((_, index) => {
            const isActive = activeIndex === index;
            const isHovered = hoveredIndex === index;
            const isAnimating = animatingIndex === index;
            
            return (
              <Cell 
                key={`cell-${tipo}-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke={isHovered || isActive ? '#333' : 'transparent'}
                strokeWidth={isHovered || isActive ? 3 : 0}
                style={{
                  filter: isHovered ? 'brightness(1.2)' : isActive ? 'brightness(1.15)' : isAnimating ? 'brightness(1.3)' : 'none',
                  opacity: isHovered || isActive ? 1 : 0.9,
                }}
              />
            );
          })}
        </Pie>
        <Tooltip content={<CustomTooltip tipo={tipo} />} />
      </PieChart>
    </ResponsiveContainer>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.data === nextProps.data &&
    prevProps.activeIndex === nextProps.activeIndex &&
    prevProps.hoveredIndex === nextProps.hoveredIndex &&
    prevProps.animatingIndex === nextProps.animatingIndex
  );
});

export default function ProjetosDashboard() {
  const [data, setData] = useState<ProjetosData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anoSelecionado, setAnoSelecionado] = useState<number>(0);
  const [programasSelecionados, setProgramasSelecionados] = useState<number[]>([]);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'graficos' | 'tabelas'>('graficos');
  const [exportandoFinanceiro, setExportandoFinanceiro] = useState(false);
  const [exportandoQuantitativo, setExportandoQuantitativo] = useState(false);
  const [regionalSelecionado, setRegionalSelecionado] = useState<string>('GERAL');

  // Chart interaction states - optimized
  const [activeQuantitativoIndex, setActiveQuantitativoIndex] = useState<number | null>(null);
  const [activeFinanceiroIndex, setActiveFinanceiroIndex] = useState<number | null>(null);
  const [hoveredQuantitativoIndex, setHoveredQuantitativoIndex] = useState<number | null>(null);
  const [hoveredFinanceiroIndex, setHoveredFinanceiroIndex] = useState<number | null>(null);
  const [showQuantitativoInfo, setShowQuantitativoInfo] = useState<number | null>(null);
  const [showFinanceiroInfo, setShowFinanceiroInfo] = useState<number | null>(null);
  const [animatingQuantitativo, setAnimatingQuantitativo] = useState<number | null>(null);
  const [animatingFinanceiro, setAnimatingFinanceiro] = useState<number | null>(null);

  // Optimized refs and memoized values
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const anoAtual = useMemo(() => new Date().getFullYear(), []);
  const anos = useMemo(() => Array.from({ length: 5 }, (_, i) => anoAtual + i), [anoAtual]);
  
  // Memoized regional mapping
  const labelToId = useMemo(() => ({
    'SEDE': 1, 'CENTRO OESTE': 2, 'NORTE': 3, 'OESTE': 4,
    'SUL': 5, 'SUDESTE': 6, 'ILCT': 7, 'ITAP': 8,
  }), []);

  // Optimized data fetching with better cleanup
  useEffect(() => {
    const abortController = new AbortController();
    const timeouts = timeoutsRef.current;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (regionalSelecionado && regionalSelecionado !== 'GERAL') {
          const rid = labelToId[regionalSelecionado as keyof typeof labelToId];
          if (rid) params.set('regionalId', String(rid));
          else params.set('regional', regionalSelecionado);
        }

        const response = await fetch(`/api/dashboard/projetos${params.toString() ? `?${params.toString()}` : ''}`, {
          signal: abortController.signal
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const result: ProjetosData = await response.json();
        
        if (result.success && !abortController.signal.aborted) {
          setData(result);
          setProgramasSelecionados(result.programas.map(p => p.id));
          setError(null);
        } else if (!abortController.signal.aborted) {
          setError(result.error || 'Erro ao carregar dados');
        }
      } catch (error: unknown) {
        if (!abortController.signal.aborted) {
          setError(error instanceof Error ? `Erro de conexão: ${error.message}` : 'Erro de conexão');
        }
      } finally {
        if (!abortController.signal.aborted) setLoading(false);
      }
    };

    fetchData();
    
    return () => {
      abortController.abort();
      // Clear all timeouts
      timeouts.forEach(timeout => clearTimeout(timeout));
      timeouts.clear();
    };
  }, [regionalSelecionado, labelToId]);

  // Memoized data processing functions for better performance
  const getDadosFiltrados = useCallback(() => {
    if (!data) return { programas: [], anos: [] };

    let programasFiltrados = data.programas;
    programasFiltrados = programasFiltrados.filter(p => programasSelecionados.includes(p.id));

    const anosParaExibir = anoSelecionado === 0 ? anos : [anoSelecionado];

    return { programas: programasFiltrados, anos: anosParaExibir };
  }, [data, programasSelecionados, anoSelecionado, anos]);

  // Memoized year data calculation
  const getDadosAnoSelecionado = useCallback(() => {
    if (!data) return { valorAno: 0, projetosAno: 0 };
    const valorAno = data.totais_gerais.valores_por_ano[anoSelecionado] || 0;
    const projetosAno = data.totais_gerais.projetos_por_ano[anoSelecionado] || 0;
    return { valorAno, projetosAno };
  }, [data, anoSelecionado]);

  // Optimized handlers with better timeout management
  const handleYearSelect = useCallback((ano: number | 'todos') => {
    setAnoSelecionado(ano === 'todos' ? 0 : ano);
  }, []);

  const handleProgramSelect = useCallback((programaId: number) => {
    setProgramasSelecionados(prev => {
      if (prev.includes(programaId)) {
        return prev.filter(id => id !== programaId);
      } else {
        return [...prev, programaId];
      }
    });
  }, []);

  const handleSelectAllPrograms = useCallback(() => {
    if (!data) return;
    
    setProgramasSelecionados(prev => 
      prev.length === data.programas.length ? [] : data.programas.map(p => p.id)
    );
  }, [data]);

  // Memoized pizza data preparation
  const prepararDadosPizza = useMemo(() => (tipoVisualizacao: 'quantitativo' | 'financeiro') => {
    const { programas } = getDadosFiltrados();
    
    const anoParaPizza = anoSelecionado !== 0 ? anoSelecionado : anoAtual;
    
    const dadosPizza = programas.map((programa, index) => {
      const valor = tipoVisualizacao === 'quantitativo' 
        ? programa.projetos_por_ano[anoParaPizza] || 0
        : programa.valores_por_ano[anoParaPizza] || 0;
      
      return {
        name: programa.nome,
        value: Number(valor) || 0,
        color: COLORS[index % COLORS.length]
      };
    }).filter(item => item.value > 0);
    
    const totalSum = dadosPizza.reduce((sum, item) => sum + item.value, 0);
    return dadosPizza.map(item => ({ ...item, totalSum }));
  }, [getDadosFiltrados, anoSelecionado, anoAtual]);

  // Optimized interaction handlers with debouncing
  const clearTimeoutKey = useCallback((key: string) => {
    const timeout = timeoutsRef.current.get(key);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(key);
    }
  }, []);

  const setTimeoutKey = useCallback((key: string, callback: () => void, delay: number) => {
    clearTimeoutKey(key);
    const timeout = setTimeout(callback, delay);
    timeoutsRef.current.set(key, timeout);
  }, [clearTimeoutKey]);

  const handleQuantitativoClick = useCallback((index: number) => {
    clearTimeoutKey('quantitativo');
    setAnimatingQuantitativo(index);
    setTimeoutKey('quantitativo', () => setAnimatingQuantitativo(null), 300);
    
    setActiveQuantitativoIndex(prev => prev === index ? null : index);
    setShowQuantitativoInfo(prev => prev === index ? null : index);
  }, [clearTimeoutKey, setTimeoutKey]);

  const handleQuantitativoMouseEnter = useCallback((index: number) => {
    setTimeoutKey('quantitativoEnter', () => setHoveredQuantitativoIndex(index), 50);
  }, [setTimeoutKey]);

  const handleQuantitativoMouseLeave = useCallback(() => {
    setTimeoutKey('quantitativoLeave', () => setHoveredQuantitativoIndex(null), 100);
  }, [setTimeoutKey]);

  const handleFinanceiroClick = useCallback((index: number) => {
    clearTimeoutKey('financeiro');
    setAnimatingFinanceiro(index);
    setTimeoutKey('financeiro', () => setAnimatingFinanceiro(null), 300);
    
    setActiveFinanceiroIndex(prev => prev === index ? null : index);
    setShowFinanceiroInfo(prev => prev === index ? null : index);
  }, [clearTimeoutKey, setTimeoutKey]);

  const handleFinanceiroMouseEnter = useCallback((index: number) => {
    setTimeoutKey('financeiroEnter', () => setHoveredFinanceiroIndex(index), 50);
  }, [setTimeoutKey]);

  const handleFinanceiroMouseLeave = useCallback(() => {
    setTimeoutKey('financeiroLeave', () => setHoveredFinanceiroIndex(null), 100);
  }, [setTimeoutKey]);

  // Função para exportar dados via API
  const exportarDados = async (tipoVisualizacao: 'quantitativo' | 'financeiro') => {
    if (!data) return;
    
    // Definir estado de loading
    if (tipoVisualizacao === 'financeiro') {
      setExportandoFinanceiro(true);
    } else {
      setExportandoQuantitativo(true);
    }
    
    try {
      // Preparar parâmetros para a API
      const { programas: programasFiltrados } = getDadosFiltrados();
      const programasIds = programasFiltrados.map(p => p.id.toString());
      
      // Determinar anos para exportação
      let anosParaExportar: string[];
      if (anoSelecionado === 0) {
        // Se "Todos" está selecionado, exportar todos os anos
        anosParaExportar = anos.map(a => a.toString());
      } else {
        // Se um ano específico está selecionado, exportar apenas esse ano
        anosParaExportar = [anoSelecionado.toString()];
      }

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
      const regionalId = labelToId[regionalSelecionado];

      const exportParams = {
        tipo: tipoVisualizacao,
        formato: 'xlsx' as const, // preferir Excel para largura de colunas
        programas: programasIds,
        anos: anosParaExportar,
        anoSelecionado: anoSelecionado,
        regional: regionalSelecionado,
        regionalId: regionalId
      };

      // Fazer requisição para a API
      const response = await fetch('/api/export/projetos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exportParams)
      });

      if (!response.ok) {
        throw new Error(`Erro na exportação: ${response.statusText}`);
      }

      // Baixar o arquivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Nome do arquivo mais descritivo
      const dataAtual = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
      const filtroAno = anoSelecionado === 0 ? 'todos-anos' : anoSelecionado.toString();
      const filtroPrograma = programasIds.length === data.programas.length ? 'todos-programas' : `${programasIds.length}-programas`;

      a.download = `projetos-${tipoVisualizacao}-${filtroAno}-${filtroPrograma}-${dataAtual}.xlsx`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Feedback visual (opcional - pode adicionar um toast/notification)
      console.log(`✅ Exportação concluída: ${a.download}`);
      
    } catch (error) {
      console.error('❌ Erro ao exportar dados:', error);
      // Aqui você pode adicionar um toast de erro para o usuário
      alert('Erro ao exportar dados. Tente novamente.');
    } finally {
      // Resetar estado de loading
      if (tipoVisualizacao === 'financeiro') {
        setExportandoFinanceiro(false);
      } else {
        setExportandoQuantitativo(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
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

  if (!data || !data.programas.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Nenhum dado encontrado</p>
        </CardContent>
      </Card>
    );
  }

  const { programas } = getDadosFiltrados();
  const { valorAno, projetosAno } = getDadosAnoSelecionado();

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Box única com filtros e KPIs */}
      <Card className="shadow-md border border-gray-100">
        <CardContent className="pt-6">
          {/* Filtros inline */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="text-gray-600" size={18} />
              <span className="text-sm text-gray-700">Regional:</span>
              <Select value={regionalSelecionado} onValueChange={setRegionalSelecionado}>
                <SelectTrigger className="h-9 w-[160px] border-2 border-emerald-700 text-emerald-800 focus:ring-emerald-700 focus-visible:ring-emerald-700">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEDE">SEDE</SelectItem>
                  <SelectItem value="CENTRO OESTE">CENTRO OESTE</SelectItem>
                  <SelectItem value="NORTE">NORTE</SelectItem>
                  <SelectItem value="ITAP">ITAP</SelectItem>
                  <SelectItem value="ILCT">ILCT</SelectItem>
                  <SelectItem value="SUL">SUL</SelectItem>
                  <SelectItem value="SUDESTE">SUDESTE</SelectItem>
                  <SelectItem value="OESTE">OESTE</SelectItem>
                  <SelectItem value="GERAL">GERAL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="text-gray-600" size={18} />
              <span className="text-sm text-gray-700">Ano:</span>
              <Select value={anoSelecionado === 0 ? 'todos' : String(anoSelecionado)} onValueChange={(val) => handleYearSelect(val === 'todos' ? 'todos' : Number(val))}>
                <SelectTrigger className="h-9 w-[120px] border-2 border-emerald-700 text-emerald-800 focus:ring-emerald-700 focus-visible:ring-emerald-700">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {anos.map((ano) => (
                    <SelectItem key={ano} value={String(ano)}>{ano}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Programas:</span>
              <Popover open={isProgramModalOpen} onOpenChange={setIsProgramModalOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-9 flex items-center gap-2 border-2 border-emerald-700 text-emerald-800 focus:ring-emerald-700 focus-visible:ring-emerald-700" aria-label="Selecionar programas">
                    <FilterIcon size={18} /> ({programasSelecionados.length}/{data?.programas.length || 0})
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-96 p-0 max-h-[70vh] overflow-y-auto">
                  <div className="p-4 pb-2 border-b">
                    <p className="text-sm font-semibold">Selecionar Programas</p>
                    <p className="text-xs text-gray-500">Escolha os programas para visualizar nos gráficos e relatórios</p>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        onClick={handleSelectAllPrograms}
                        className="text-sm"
                      >
                        {data && programasSelecionados.length === data.programas.length ? 'Deselecionar Todos' : 'Selecionar Todos'}
                      </Button>
                      <span className="text-sm text-gray-500">
                        {programasSelecionados.length} de {data?.programas.length || 0} selecionados
                      </span>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {data?.programas.map((programa) => (
                        <div key={programa.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50">
                          <input
                            type="checkbox"
                            id={`programa-${programa.id}`}
                            checked={programasSelecionados.includes(programa.id)}
                            onChange={() => handleProgramSelect(programa.id)}
                            className="h-4 w-4 text-[#025C3E] focus:ring-[#025C3E] border-gray-300 rounded"
                          />
                          <label 
                            htmlFor={`programa-${programa.id}`}
                            className="flex-1 text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            {programa.nome}
                          </label>
                          <span className="text-xs text-gray-500">
                            {programa.total_projetos} projetos
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end pt-4 border-t">
                      <Button
                        onClick={() => setIsProgramModalOpen(false)}
                        className="bg-[#025C3E] hover:bg-[#157A5B]"
                      >
                        Aplicar Filtros
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* KPIs em 4 caixas */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
              <div className="text-sm text-gray-700 mb-1">Projetos (Total)</div>
              <div className="text-2xl md:text-2xl font-extrabold text-blue-700">
                {data ? data.totais_gerais.total_projetos_geral : 0}
              </div>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
              <div className="text-sm text-gray-700 mb-1">Projetos (Ano)</div>
              <div className="text-2xl md:text-2xl font-extrabold text-red-700">
                {anoSelecionado === 0 ? (data ? data.totais_gerais.projetos_ano_vigente : 0) : projetosAno}
              </div>
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4">
              <div className="text-sm text-gray-700 mb-1">Valor (Total)</div>
              <div className="text-2xl md:text-2xl font-extrabold text-green-700">
                R$ {data ? data.totais_gerais.valor_total_geral.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
              </div>
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4">
              <div className="text-sm text-gray-700 mb-1">Valor (Ano)</div>
              <div className="text-2xl md:text-2xl font-extrabold text-green-700">
                R$ {(anoSelecionado === 0 ? data?.totais_gerais.valor_ano_vigente : valorAno)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Programas agora em Popover (não modal) */}
        </CardContent>
      </Card>

      {/* Switch de Visualização */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setViewMode('graficos')}
            className={`px-8 py-3 rounded-md text-base font-medium transition-all duration-200 ${
              viewMode === 'graficos'
                ? 'bg-[#025C3E] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📊 Gráficos
          </button>
          <button
            onClick={() => setViewMode('tabelas')}
            className={`px-8 py-3 rounded-md text-base font-medium transition-all duration-200 ${
              viewMode === 'tabelas'
                ? 'bg-[#025C3E] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📋 Tabelas
          </button>
        </div>
      </div>

      {/* Renderização Condicional - Gráficos ou Tabelas */}
      {viewMode === 'graficos' ? (
        /* Gráficos */
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          {/* Gráfico de Projetos por Programa */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg md:text-xl">
                Projetos por Programa - {anoSelecionado === 0 ? 'Todos os Anos' : anoSelecionado}
              </CardTitle>
              <p className="text-sm text-gray-500">Clique nas fatias para destacar</p>
            </CardHeader>
            <CardContent className="relative">
              {/* Caixinha de informações para gráfico quantitativo */}
              {showQuantitativoInfo !== null && (() => {
                const dadosPizza = prepararDadosPizza('quantitativo');
                const item = dadosPizza[showQuantitativoInfo];
                return item && (
                  <InfoBox
                    item={{ nome: item.name, value: item.value, totalSum: item.totalSum }}
                    isVisible={showQuantitativoInfo !== null}
                    onClose={() => setShowQuantitativoInfo(null)}
                    color={COLORS[showQuantitativoInfo % COLORS.length]}
                    isAnimating={animatingQuantitativo === showQuantitativoInfo}
                    tipo="quantitativo"
                  />
                );
              })()}
              
              <Suspense fallback={<div className="h-80 animate-pulse bg-gray-200 rounded" />}>
                <MemoizedPieChart
                  data={prepararDadosPizza('quantitativo')}
                  onSliceClick={handleQuantitativoClick}
                  activeIndex={activeQuantitativoIndex}
                  hoveredIndex={hoveredQuantitativoIndex}
                  animatingIndex={animatingQuantitativo}
                  tipo="quantitativo"
                />
              </Suspense>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {prepararDadosPizza('quantitativo').map((programa, index) => (
                  <div 
                    key={`${programa.name}-${index}`} 
                    className={`flex items-center gap-2 text-sm cursor-pointer p-2 rounded transition-all duration-200 ${
                      activeQuantitativoIndex === index ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleQuantitativoClick(index)}
                    onMouseEnter={() => handleQuantitativoMouseEnter(index)}
                    onMouseLeave={handleQuantitativoMouseLeave}
                  >
                    <span
                      className={`inline-block w-3 h-3 rounded-full transition-all duration-200 ${
                        hoveredQuantitativoIndex === index || activeQuantitativoIndex === index ? 'w-4 h-4' : ''
                      }`}
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className={`text-gray-700 truncate ${activeQuantitativoIndex === index ? 'font-semibold' : ''}`}>
                      {programa.name}
                    </span>
                    {(activeQuantitativoIndex === index || hoveredQuantitativoIndex === index) && (
                      <span className="ml-auto text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {programa.value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Dados Financeiros */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg md:text-xl">
                Dados Financeiros - {anoSelecionado === 0 ? 'Todos os Anos' : anoSelecionado}
              </CardTitle>
              <p className="text-sm text-gray-500">Clique nas fatias para destacar</p>
            </CardHeader>
            <CardContent className="relative">
              {/* Caixinha de informações para gráfico financeiro */}
              {showFinanceiroInfo !== null && (() => {
                const dadosPizza = prepararDadosPizza('financeiro');
                const item = dadosPizza[showFinanceiroInfo];
                return item && (
                  <InfoBox
                    item={{ nome: item.name, value: item.value, totalSum: item.totalSum }}
                    isVisible={showFinanceiroInfo !== null}
                    onClose={() => setShowFinanceiroInfo(null)}
                    color={COLORS[showFinanceiroInfo % COLORS.length]}
                    isAnimating={animatingFinanceiro === showFinanceiroInfo}
                    tipo="financeiro"
                  />
                );
              })()}
              
              <Suspense fallback={<div className="h-80 animate-pulse bg-gray-200 rounded" />}>
                <MemoizedPieChart
                  data={prepararDadosPizza('financeiro')}
                  onSliceClick={handleFinanceiroClick}
                  activeIndex={activeFinanceiroIndex}
                  hoveredIndex={hoveredFinanceiroIndex}
                  animatingIndex={animatingFinanceiro}
                  tipo="financeiro"
                />
              </Suspense>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {prepararDadosPizza('financeiro').map((programa, index) => (
                  <div 
                    key={`${programa.name}-${index}`} 
                    className={`flex items-center gap-2 text-sm cursor-pointer p-2 rounded transition-all duration-200 ${
                      activeFinanceiroIndex === index ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleFinanceiroClick(index)}
                    onMouseEnter={() => handleFinanceiroMouseEnter(index)}
                    onMouseLeave={handleFinanceiroMouseLeave}
                  >
                    <span
                      className={`inline-block w-3 h-3 rounded-full transition-all duration-200 ${
                        hoveredFinanceiroIndex === index || activeFinanceiroIndex === index ? 'w-4 h-4' : ''
                      }`}
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className={`text-gray-700 truncate ${activeFinanceiroIndex === index ? 'font-semibold' : ''}`}>
                      {programa.name}
                    </span>
                    {(activeFinanceiroIndex === index || hoveredFinanceiroIndex === index) && (
                      <span className="ml-auto text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(programa.value)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Tabelas */
        <>
          {/* Relatório Detalhado Financeiro */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#025C3E] rounded-full"></div>
                    Relatório Detalhado por Programa - Financeiro
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Dados financeiros completos por programa e ano
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => exportarDados('financeiro')}
                  disabled={exportandoFinanceiro}
                  className="bg-[#025C3E] hover:bg-[#157A5B] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {exportandoFinanceiro ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Exportando...
                    </>
                  ) : (
                    <>
                      <DownloadIcon size={16} />
                      Exportar Financeiro
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Versão Mobile - Cards */}
              <div className="block lg:hidden space-y-4">
                {programas.map((programa, index) => (
                  <Card key={programa.id} className="border-2 border-gray-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        {programa.nome}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        {anoSelecionado === 0 ? (
                          // Mostrar todos os anos
                          anos.map(ano => (
                            <div key={ano} className="flex justify-between py-1 border-b border-gray-100">
                              <span className="font-medium">{ano}:</span>
                              <span>R$ {(programa.valores_por_ano[ano] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                          ))
                        ) : (
                          // Mostrar apenas o ano selecionado
                          <div className="flex justify-between py-1 border-b border-gray-100">
                            <span className="font-medium">{anoSelecionado}:</span>
                            <span>R$ {(programa.valores_por_ano[anoSelecionado] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                        )}
                        <div className="flex justify-between py-2 border-t-2 border-gray-200 font-bold">
                          <span>Total Geral:</span>
                          <span className="text-[#025C3E]">
                            R$ {programa.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Versão Desktop - Tabela */}
              <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-[#025C3E] text-white">
                      <th className="border border-gray-200 p-3 px-4 text-left font-semibold">Programa</th>
                      {anoSelecionado === 0 ? (
                        // Mostrar todos os anos
                        anos.map(ano => (
                          <th key={ano} className="border border-gray-200 p-3 px-4 text-right font-semibold min-w-[140px] whitespace-nowrap">
                            {ano}<br />
                            <span className="text-xs font-normal">(Valor R$)</span>
                          </th>
                        ))
                      ) : (
                        // Mostrar apenas o ano selecionado
                        <th className="border border-gray-200 p-3 px-4 text-right font-semibold min-w-[140px] whitespace-nowrap">
                          {anoSelecionado}<br />
                          <span className="text-xs font-normal">(Valor R$)</span>
                        </th>
                      )}
                      <th className="border border-gray-200 p-3 px-4 text-right font-semibold min-w-[150px] whitespace-nowrap">
                        Total<br />
                        <span className="text-xs font-normal">(Aprovado R$)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {programas.map((programa, index) => (
                      <tr key={programa.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100/60 transition-colors`}>
                        <td className="border border-gray-200 p-3 px-4 font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            {programa.nome}
                          </div>
                        </td>
                        {anoSelecionado === 0 ? (
                          // Mostrar todos os anos
                          anos.map(ano => (
                            <td key={ano} className="border border-gray-200 p-3 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                              {(programa.valores_por_ano[ano] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                          ))
                        ) : (
                          // Mostrar apenas o ano selecionado
                          <td className="border border-gray-200 p-3 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                            {(programa.valores_por_ano[anoSelecionado] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                        )}
                        <td className="border border-gray-200 p-3 px-4 text-right font-bold text-[#025C3E]">
                          {programa.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                    
                    {/* Linha de Totais */}
                    <tr className="bg-[#025C3E] text-white font-bold">
                      <td className="border border-gray-200 p-3 px-4">TOTAL GERAL</td>
                      {anoSelecionado === 0 ? (
                        // Mostrar todos os anos
                        anos.map(ano => (
                          <td key={ano} className="border border-gray-200 p-3 px-4 text-right whitespace-nowrap">
                            {(data.totais_gerais.valores_por_ano[ano] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                        ))
                      ) : (
                        // Mostrar apenas o ano selecionado
                        <td className="border border-gray-200 p-3 px-4 text-right whitespace-nowrap">
                          {(data.totais_gerais.valores_por_ano[anoSelecionado] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      )}
                      <td className="border border-gray-200 p-3 px-4 text-right whitespace-nowrap">
                        {data.totais_gerais.valor_total_geral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Relatório Detalhado Quantitativo */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#157A5B] rounded-full"></div>
                    Relatório Detalhado por Programa - Quantitativo
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Dados quantitativos completos por programa e ano
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => exportarDados('quantitativo')}
                  disabled={exportandoQuantitativo}
                  className="bg-[#157A5B] hover:bg-[#025C3E] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {exportandoQuantitativo ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Exportando...
                    </>
                  ) : (
                    <>
                      <DownloadIcon size={16} />
                      Exportar Quantitativo
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Versão Mobile - Cards */}
              <div className="block lg:hidden space-y-4">
                {programas.map((programa, index) => (
                  <Card key={programa.id} className="border-2 border-gray-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        {programa.nome}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {anoSelecionado === 0 ? (
                          // Mostrar todos os anos
                          anos.map(ano => (
                            <div key={ano} className="flex justify-between py-1 border-b border-gray-100">
                              <span className="font-medium">{ano}:</span>
                              <span>{programa.projetos_por_ano[ano] || 0}</span>
                            </div>
                          ))
                        ) : (
                          // Mostrar apenas o ano selecionado
                          <div className="flex justify-between py-1 border-b border-gray-100">
                            <span className="font-medium">{anoSelecionado}:</span>
                            <span>{programa.projetos_por_ano[anoSelecionado] || 0}</span>
                          </div>
                        )}
                        <div className="col-span-2 flex justify-between py-2 border-t-2 border-gray-200 font-bold">
                          <span>Total Geral:</span>
                          <span className="text-[#157A5B]">{programa.total_projetos}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Versão Desktop - Tabela */}
              <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-[#157A5B] text-white">
                      <th className="border border-gray-200 p-3 px-4 text-left font-semibold">Programa</th>
                      {anoSelecionado === 0 ? (
                        // Mostrar todos os anos
                        anos.map(ano => (
                          <th key={ano} className="border border-gray-200 p-3 px-4 text-right font-semibold min-w-[120px] whitespace-nowrap">
                            {ano}<br />
                            <span className="text-xs font-normal">(Qtd)</span>
                          </th>
                        ))
                      ) : (
                        // Mostrar apenas o ano selecionado
                        <th className="border border-gray-200 p-3 px-4 text-right font-semibold min-w-[120px] whitespace-nowrap">
                          {anoSelecionado}<br />
                          <span className="text-xs font-normal">(Qtd)</span>
                        </th>
                      )}
                      <th className="border border-gray-200 p-3 px-4 text-right font-semibold min-w-[150px] whitespace-nowrap">
                        Total<br />
                        <span className="text-xs font-normal">(Projetos)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {programas.map((programa, index) => (
                      <tr key={programa.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100/60 transition-colors`}>
                        <td className="border border-gray-200 p-3 px-4 font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            {programa.nome}
                          </div>
                        </td>
                        {anoSelecionado === 0 ? (
                          // Mostrar todos os anos
                          anos.map(ano => (
                            <td key={ano} className="border border-gray-200 p-3 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                              {programa.projetos_por_ano[ano] || 0}
                            </td>
                          ))
                        ) : (
                          // Mostrar apenas o ano selecionado
                          <td className="border border-gray-200 p-3 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                            {programa.projetos_por_ano[anoSelecionado] || 0}
                          </td>
                        )}
                        <td className="border border-gray-200 p-3 px-4 text-right font-bold text-[#157A5B]">
                          {programa.total_projetos}
                        </td>
                      </tr>
                    ))}
                    
                    {/* Linha de Totais */}
                    <tr className="bg-[#157A5B] text-white font-bold">
                      <td className="border border-gray-200 p-3 px-4">TOTAL GERAL</td>
                      {anoSelecionado === 0 ? (
                        // Mostrar todos os anos
                        anos.map(ano => (
                          <td key={ano} className="border border-gray-200 p-3 px-4 text-right whitespace-nowrap">
                            {data.totais_gerais.projetos_por_ano[ano] || 0}
                          </td>
                        ))
                      ) : (
                        // Mostrar apenas o ano selecionado
                        <td className="border border-gray-200 p-3 px-4 text-right whitespace-nowrap">
                          {data.totais_gerais.projetos_por_ano[anoSelecionado] || 0}
                        </td>
                      )}
                      <td className="border border-gray-200 p-3 px-4 text-right whitespace-nowrap">
                        {data.totais_gerais.total_projetos_geral}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}