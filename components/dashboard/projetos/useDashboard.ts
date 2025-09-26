'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ProjetosData, ChartDataItem, TipoVisualizacao } from './types';
import { REGIONAL_MAPPING, COLORS } from './constants';

export function useDashboard() {
  // Data states
  const [data, setData] = useState<ProjetosData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [anoSelecionado, setAnoSelecionado] = useState<number>(0);
  const [programasSelecionados, setProgramasSelecionados] = useState<number[]>([]);
  const [regionalSelecionado, setRegionalSelecionado] = useState<string>('GERAL');
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'graficos' | 'tabelas'>('graficos');

  // Export states
  const [exportandoFinanceiro, setExportandoFinanceiro] = useState(false);
  const [exportandoQuantitativo, setExportandoQuantitativo] = useState(false);

  // Chart interaction states
  const [activeQuantitativoIndex, setActiveQuantitativoIndex] = useState<number | null>(null);
  const [activeFinanceiroIndex, setActiveFinanceiroIndex] = useState<number | null>(null);
  const [hoveredQuantitativoIndex, setHoveredQuantitativoIndex] = useState<number | null>(null);
  const [hoveredFinanceiroIndex, setHoveredFinanceiroIndex] = useState<number | null>(null);
  const [showQuantitativoInfo, setShowQuantitativoInfo] = useState<number | null>(null);
  const [showFinanceiroInfo, setShowFinanceiroInfo] = useState<number | null>(null);
  const [animatingQuantitativo, setAnimatingQuantitativo] = useState<number | null>(null);
  const [animatingFinanceiro, setAnimatingFinanceiro] = useState<number | null>(null);

  // Refs and memoized values
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const anoAtual = useMemo(() => new Date().getFullYear(), []);
  const anos = useMemo(() => Array.from({ length: 5 }, (_, i) => anoAtual + i), [anoAtual]);

  // Data fetching
  useEffect(() => {
    const abortController = new AbortController();
    const timeouts = timeoutsRef.current;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (regionalSelecionado && regionalSelecionado !== 'GERAL') {
          const rid = REGIONAL_MAPPING[regionalSelecionado as keyof typeof REGIONAL_MAPPING];
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
      timeouts.forEach(timeout => clearTimeout(timeout));
      timeouts.clear();
    };
  }, [regionalSelecionado]);

  // Timeout management helpers
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

  // Data processing functions
  const getDadosFiltrados = useCallback(() => {
    if (!data) return { programas: [], anos: [] };

    let programasFiltrados = data.programas;
    programasFiltrados = programasFiltrados.filter(p => programasSelecionados.includes(p.id));

    const anosParaExibir = anoSelecionado === 0 ? anos : [anoSelecionado];

    return { programas: programasFiltrados, anos: anosParaExibir };
  }, [data, programasSelecionados, anoSelecionado, anos]);

  const getDadosAnoSelecionado = useCallback(() => {
    if (!data) return { valorAno: 0, projetosAno: 0 };
    const valorAno = data.totais_gerais.valores_por_ano[anoSelecionado] || 0;
    const projetosAno = data.totais_gerais.projetos_por_ano[anoSelecionado] || 0;
    return { valorAno, projetosAno };
  }, [data, anoSelecionado]);

  const prepararDadosPizza = useMemo(() => (tipoVisualizacao: TipoVisualizacao): ChartDataItem[] => {
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

  // Handler functions
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

  // Chart interaction handlers
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

  // Export function
  const exportarDados = async (tipoVisualizacao: TipoVisualizacao) => {
    if (!data) return;
    
    if (tipoVisualizacao === 'financeiro') {
      setExportandoFinanceiro(true);
    } else {
      setExportandoQuantitativo(true);
    }
    
    try {
      const { programas: programasFiltrados } = getDadosFiltrados();
      const programasIds = programasFiltrados.map(p => p.id.toString());
      
      let anosParaExportar: string[];
      if (anoSelecionado === 0) {
        anosParaExportar = anos.map(a => a.toString());
      } else {
        anosParaExportar = [anoSelecionado.toString()];
      }

      const regionalId = REGIONAL_MAPPING[regionalSelecionado as keyof typeof REGIONAL_MAPPING];

      const exportParams = {
        tipo: tipoVisualizacao,
        formato: 'xlsx' as const,
        programas: programasIds,
        anos: anosParaExportar,
        anoSelecionado: anoSelecionado,
        regional: regionalSelecionado,
        regionalId: regionalId
      };

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

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      const dataAtual = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
      const filtroAno = anoSelecionado === 0 ? 'todos-anos' : anoSelecionado.toString();
      const filtroPrograma = programasIds.length === data.programas.length ? 'todos-programas' : `${programasIds.length}-programas`;

      a.download = `projetos-${tipoVisualizacao}-${filtroAno}-${filtroPrograma}-${dataAtual}.xlsx`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      console.log(`✅ Exportação concluída: ${a.download}`);
      
    } catch (error) {
      console.error('❌ Erro ao exportar dados:', error);
      alert('Erro ao exportar dados. Tente novamente.');
    } finally {
      if (tipoVisualizacao === 'financeiro') {
        setExportandoFinanceiro(false);
      } else {
        setExportandoQuantitativo(false);
      }
    }
  };

  return {
    // States
    data,
    loading,
    error,
    anoSelecionado,
    programasSelecionados,
    regionalSelecionado,
    isProgramModalOpen,
    viewMode,
    exportandoFinanceiro,
    exportandoQuantitativo,
    
    // Chart states
    activeQuantitativoIndex,
    activeFinanceiroIndex,
    hoveredQuantitativoIndex,
    hoveredFinanceiroIndex,
    showQuantitativoInfo,
    showFinanceiroInfo,
    animatingQuantitativo,
    animatingFinanceiro,
    
    // Computed values
    anos,
    
    // Functions
    getDadosFiltrados,
    getDadosAnoSelecionado,
    prepararDadosPizza,
    exportarDados,
    
    // Handlers
    handleYearSelect,
    handleProgramSelect,
    handleSelectAllPrograms,
    handleQuantitativoClick,
    handleQuantitativoMouseEnter,
    handleQuantitativoMouseLeave,
    handleFinanceiroClick,
    handleFinanceiroMouseEnter,
    handleFinanceiroMouseLeave,
    
    // Setters
    setRegionalSelecionado,
    setIsProgramModalOpen,
    setViewMode,
    setShowQuantitativoInfo,
    setShowFinanceiroInfo,
  };
}