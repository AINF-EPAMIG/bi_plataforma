'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CalendarIcon, DollarSignIcon, TrendingUpIcon, FilterIcon, DownloadIcon } from 'lucide-react';

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

// Alias para manter compatibilidade
type DashboardData = ProjetosData;

const COLORS = [
  '#970FF2', // Roxo vibrante
  '#0597F2', // Azul vibrante
  '#49D907', // Verde lima
  '#0000FF', // Azul puro
  '#EAF205', // Amarelo vibrante
  '#6BDDFD', // Azul claro
  '#F24607', // Laranja vermelho
  '#8F0054', // Magenta escuro
  '#FF9100', // Laranja vibrante
  '#35792E', // Verde escuro
  '#54ED65', // Verde claro vibrante
  '#BA1979', // Rosa magenta
  '#68D31B', // Verde lima claro
  '#00FFF7', // Ciano vibrante
];

export default function ProjetosDashboard() {
  const [data, setData] = useState<ProjetosData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroPrograma] = useState<string>('todos');
  const [filtroAno] = useState<string>('todos');
  const [anoSelecionado, setAnoSelecionado] = useState<number>(0); // 0 representa "Todos os Anos"
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [programasSelecionados, setProgramasSelecionados] = useState<number[]>([]);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'graficos' | 'tabelas'>('graficos');
  const [exportandoFinanceiro, setExportandoFinanceiro] = useState(false);
  const [exportandoQuantitativo, setExportandoQuantitativo] = useState(false);

  // Gerar anos dinamicamente (ano atual + 4 anos)
  const anoAtual = new Date().getFullYear();
  const anos = Array.from({ length: 5 }, (_, i) => anoAtual + i);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard/projetos');
        const result: DashboardData = await response.json();
        
        if (result.success) {
          setData(result);
          // Inicializar todos os programas como selecionados
          setProgramasSelecionados(result.programas.map(p => p.id));
        } else {
          setError(result.error || 'Erro ao carregar dados');
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError('Erro de conexão com o servidor: ' + error.message);
        } else {
          setError('Erro de conexão com o servidor');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Função para calcular dados do ano selecionado
  const getDadosAnoSelecionado = () => {
    if (!data) return { valorAno: 0, projetosAno: 0 };

    const valorAno = data.totais_gerais.valores_por_ano[anoSelecionado] || 0;
    const projetosAno = data.totais_gerais.projetos_por_ano[anoSelecionado] || 0;

    return { valorAno, projetosAno };
  };

  // Função para lidar com seleção de ano
  const handleYearSelect = (ano: number | 'todos') => {
    if (ano === 'todos') {
      setAnoSelecionado(0); // Usar 0 para representar "todos"
    } else {
      setAnoSelecionado(ano);
    }
    setIsYearModalOpen(false);
  };

  // Função para lidar com seleção de programas
  const handleProgramSelect = (programaId: number) => {
    setProgramasSelecionados(prev => {
      if (prev.includes(programaId)) {
        return prev.filter(id => id !== programaId);
      } else {
        return [...prev, programaId];
      }
    });
  };

  // Função para selecionar/deselecionar todos os programas
  const handleSelectAllPrograms = () => {
    if (!data) return;
    
    if (programasSelecionados.length === data.programas.length) {
      // Se todos estão selecionados, deselecionar todos
      setProgramasSelecionados([]);
    } else {
      // Caso contrário, selecionar todos
      setProgramasSelecionados(data.programas.map(p => p.id));
    }
  };

  // Função para filtrar dados
  const getDadosFiltrados = () => {
    if (!data) return { programas: [], anos: [] };

    let programasFiltrados = data.programas;

    // Filtrar por programas selecionados no modal
    programasFiltrados = programasFiltrados.filter(p => programasSelecionados.includes(p.id));

    if (filtroPrograma !== 'todos') {
      programasFiltrados = programasFiltrados.filter(p => p.id.toString() === filtroPrograma);
    }

    // Se um ano específico está selecionado no filtro, usar esse ano
    // Caso contrário, usar o ano selecionado no card de resumo
    let anosParaExibir: number[];
    if (filtroAno !== 'todos') {
      anosParaExibir = [parseInt(filtroAno)];
    } else if (anoSelecionado === 0) {
      // Se "Todos" foi selecionado, mostrar todos os anos
      anosParaExibir = anos;
    } else {
      // Mostrar apenas o ano selecionado
      anosParaExibir = [anoSelecionado];
    }

    return {
      programas: programasFiltrados,
      anos: anosParaExibir
    };
  };

  // Função para preparar dados para gráficos
  const prepararDadosGraficos = (tipoVisualizacao: 'quantitativo' | 'financeiro') => {
    const { programas } = getDadosFiltrados();
    
    // Se filtro de ano está ativo, usar apenas esse ano
    // Caso contrário, usar o ano selecionado no card de resumo
    let anosParaGrafico: number[];
    if (filtroAno !== 'todos') {
      anosParaGrafico = [parseInt(filtroAno)];
    } else if (anoSelecionado === 0) {
      // Se "Todos" foi selecionado, mostrar todos os anos
      anosParaGrafico = anos;
    } else {
      // Mostrar apenas o ano selecionado
      anosParaGrafico = [anoSelecionado];
    }
    
    return anosParaGrafico.map(ano => {
      const anoData: Record<string, string | number> = { ano: ano.toString() };
      
      programas.forEach(programa => {
        const valor = tipoVisualizacao === 'quantitativo' 
          ? programa.projetos_por_ano[ano] || 0
          : programa.valores_por_ano[ano] || 0;
        
        anoData[programa.nome] = valor;
      });
      
      return anoData;
    });
  };

  // Função para preparar dados para gráfico de pizza
  const prepararDadosPizza = (tipoVisualizacao: 'quantitativo' | 'financeiro') => {
    const { programas } = getDadosFiltrados();
    
    // Determinar o ano para o gráfico de pizza
    let anoParaPizza: number;
    if (filtroAno !== 'todos') {
      // Se um filtro de ano específico está ativo, usar esse ano
      anoParaPizza = parseInt(filtroAno);
    } else if (anoSelecionado !== 0) {
      // Se um ano específico foi selecionado no card de resumo
      anoParaPizza = anoSelecionado;
    } else {
      // Fallback para o ano atual se nenhum estiver selecionado
      anoParaPizza = anoAtual;
    }
    
    const dadosPizza = programas.map((programa, index) => {
      const valor = tipoVisualizacao === 'quantitativo' 
        ? programa.projetos_por_ano[anoParaPizza] || 0
        : programa.valores_por_ano[anoParaPizza] || 0;
      
      return {
        name: programa.nome,
        value: Number(valor) || 0,
        color: COLORS[index % COLORS.length]
      };
    }).filter(item => item.value > 0); // Filtrar apenas valores maiores que 0
    
    return dadosPizza;
  };

  // Função para verificar se deve mostrar gráfico de pizza
  const deveExibirGraficoPizza = () => {
    // Mostrar pizza se um ano específico foi selecionado no filtro
    if (filtroAno !== 'todos') {
      return true;
    }
    // OU se um ano específico foi selecionado no card de resumo (diferente de "Todos")
    if (anoSelecionado !== 0) {
      return true;
    }
    return false;
  };

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

      const exportParams = {
        tipo: tipoVisualizacao,
        formato: 'xlsx' as const, // preferir Excel para largura de colunas
        programas: programasIds,
        anos: anosParaExportar,
        anoSelecionado: anoSelecionado
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
      {/* Card de Resumo - AGORA MOSTRA DADOS DO ANO SELECIONADO */}
      <div className="relative overflow-hidden">
        <Card className="bg-gradient-to-br from-[#025C3E] via-[#157A5B] to-[#228B77] text-white border-0">
          <CardContent className="relative z-10 py-4 md:py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <Dialog open={isYearModalOpen} onOpenChange={setIsYearModalOpen}>
                <DialogTrigger asChild>
                  <div className="p-3 rounded-lg transition-all duration-300 hover:bg-white/10 hover:scale-105 cursor-pointer">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CalendarIcon size={20} />
                      <span className="text-sm font-medium">Ano Selecionado</span>
                    </div>
                    <p className="text-xl md:text-2xl font-bold">
                      {anoSelecionado === 0 ? 'Todos' : anoSelecionado}
                    </p>
                    <p className="text-xs text-green-100 mt-1">clique para alterar</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Selecionar Ano</DialogTitle>
                    <DialogDescription>
                      Escolha o ano para visualizar os dados no resumo
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-3 py-4">
                    <Button
                      variant={anoSelecionado === 0 ? "default" : "outline"}
                      onClick={() => handleYearSelect('todos')}
                      className={`h-12 col-span-2 ${anoSelecionado === 0 ? 'bg-[#025C3E] hover:bg-[#157A5B]' : ''}`}
                    >
                      Todos os Anos
                    </Button>
                    {anos.map(ano => (
                      <Button
                        key={ano}
                        variant={ano === anoSelecionado ? "default" : "outline"}
                        onClick={() => handleYearSelect(ano)}
                        className={`h-12 ${ano === anoSelecionado ? 'bg-[#025C3E] hover:bg-[#157A5B]' : ''}`}
                      >
                        {ano}
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              
              <div className="p-3 rounded-lg transition-all duration-300 hover:bg-white/10 hover:scale-105 cursor-pointer">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUpIcon size={20} />
                  <span className="text-sm font-medium">
                    Projetos {anoSelecionado === 0 ? 'Total' : anoSelecionado}
                  </span>
                </div>
                <p className="text-xl md:text-2xl font-bold">
                  {anoSelecionado === 0 ? data.totais_gerais.total_projetos_geral : projetosAno}
                </p>
                <p className="text-xs text-green-100 mt-1">
                  {anoSelecionado === 0 ? 'de todos os anos' : 'do ano selecionado'}
                </p>
              </div>
              <div className="p-3 rounded-lg transition-all duration-300 hover:bg-white/10 hover:scale-105 cursor-pointer">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSignIcon size={20} />
                  <span className="text-sm font-medium">
                    Valor {anoSelecionado === 0 ? 'Total' : anoSelecionado}
                  </span>
                </div>
                <p className="text-lg md:text-xl font-bold">
                  R$ {anoSelecionado === 0 
                    ? data.totais_gerais.valor_total_geral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                    : valorAno.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                  }
                </p>
                <p className="text-xs text-green-100 mt-1">
                  {anoSelecionado === 0 ? 'de todos os anos' : 'do ano selecionado'}
                </p>
              </div>
              <Dialog open={isProgramModalOpen} onOpenChange={setIsProgramModalOpen}>
                <DialogTrigger asChild>
                  <div className="p-3 rounded-lg transition-all duration-300 hover:bg-white/10 hover:scale-105 cursor-pointer">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <FilterIcon size={20} />
                      <span className="text-sm font-medium">Programas</span>
                    </div>
                    <p className="text-xl md:text-2xl font-bold">
                      {programasSelecionados.length}/{data.programas.length}
                    </p>
                    <p className="text-xs text-green-100 mt-1">clique para filtrar</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Selecionar Programas</DialogTitle>
                    <DialogDescription>
                      Escolha os programas que deseja visualizar nos gráficos e relatórios
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        onClick={handleSelectAllPrograms}
                        className="text-sm"
                      >
                        {programasSelecionados.length === data.programas.length ? 'Deselecionar Todos' : 'Selecionar Todos'}
                      </Button>
                      <span className="text-sm text-gray-500">
                        {programasSelecionados.length} de {data.programas.length} selecionados
                      </span>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {data.programas.map((programa) => (
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
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>

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
          {/* Gráfico de Barras/Pizza - Projetos por Ano */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <div className="w-2 h-2 bg-[#228B77] rounded-full"></div>
                Projetos por Programa - {anoSelecionado === 0 ? 'Todos os Anos' : anoSelecionado}
              </CardTitle>
              <CardDescription className="text-sm">
                Quantidade de projetos por programa {anoSelecionado === 0 ? 'em todos os anos' : `no ano ${anoSelecionado}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
                {deveExibirGraficoPizza() ? (
                  <>
                    {/* Gráfico de Pizza */}
                    <div className="flex-shrink-0">
                      <ResponsiveContainer width={300} height={300}>
                        <PieChart>
                          <Pie
                            data={prepararDadosPizza('quantitativo')}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            stroke="#fff"
                            strokeWidth={2}
                          >
                            {prepararDadosPizza('quantitativo').map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [value, 'Projetos']}
                            labelFormatter={(label) => `Programa: ${label}`}
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '2px solid #228B77',
                              borderRadius: '8px',
                              fontSize: '14px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Legenda Personalizada */}
                    <div className="flex flex-col gap-3 min-w-0 flex-1">
                      <h4 className="font-semibold text-gray-700 mb-2">Distribuição por Programa</h4>
                      {(() => {
                        const dadosPizza = prepararDadosPizza('quantitativo');
                        const total = dadosPizza.reduce((sum, item) => sum + item.value, 0);
                        
                        return dadosPizza.map((entry, index) => {
                          const percentage = total > 0 ? (entry.value / total * 100) : 0;
                          return (
                            <div key={index} className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div 
                                  className="w-4 h-4 rounded-full flex-shrink-0" 
                                  style={{ backgroundColor: entry.color }}
                                ></div>
                                <span className="text-sm text-gray-700 truncate">{entry.name}</span>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-sm font-semibold text-gray-900">{entry.value}</span>
                                <span className="text-sm text-gray-500 min-w-[45px] text-right">
                                  {percentage.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          );
                        });
                      })()}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between items-center font-semibold text-gray-800">
                          <span>Total</span>
                          <span>{prepararDadosPizza('quantitativo').reduce((sum, item) => sum + item.value, 0)}</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={prepararDadosGraficos('quantitativo')} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip 
                        formatter={(value, name) => [value, name]}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '2px solid #228B77',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      {programas.map((programa, index) => (
                        <Bar 
                          key={programa.id}
                          dataKey={programa.nome} 
                          fill={COLORS[index % COLORS.length]} 
                          radius={[2, 2, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Barras/Pizza - Dados Financeiros */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <div className="w-2 h-2 bg-[#2F9C93] rounded-full"></div>
                Dados Financeiros - {anoSelecionado === 0 ? 'Todos os Anos' : anoSelecionado}
              </CardTitle>
              <CardDescription className="text-sm">
                Valores financeiros por programa {anoSelecionado === 0 ? 'em todos os anos' : `no ano ${anoSelecionado}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
                {deveExibirGraficoPizza() ? (
                  <>
                    {/* Gráfico de Pizza */}
                    <div className="flex-shrink-0">
                      <ResponsiveContainer width={300} height={300}>
                        <PieChart>
                          <Pie
                            data={prepararDadosPizza('financeiro')}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            stroke="#fff"
                            strokeWidth={2}
                          >
                            {prepararDadosPizza('financeiro').map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Valor']}
                            labelFormatter={(label) => `Programa: ${label}`}
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '2px solid #2F9C93',
                              borderRadius: '8px',
                              fontSize: '14px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Legenda Personalizada */}
                    <div className="flex flex-col gap-3 min-w-0 flex-1">
                      <h4 className="font-semibold text-gray-700 mb-2">Distribuição Financeira</h4>
                      {(() => {
                        const dadosPizza = prepararDadosPizza('financeiro');
                        const total = dadosPizza.reduce((sum, item) => sum + item.value, 0);
                        
                        return dadosPizza.map((entry, index) => {
                          const percentage = total > 0 ? (entry.value / total * 100) : 0;
                          return (
                            <div key={index} className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div 
                                  className="w-4 h-4 rounded-full flex-shrink-0" 
                                  style={{ backgroundColor: entry.color }}
                                ></div>
                                <span className="text-sm text-gray-700 truncate">{entry.name}</span>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-sm font-semibold text-gray-900">
                                  R$ {Number(entry.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                                <span className="text-sm text-gray-500 min-w-[45px] text-right">
                                  {percentage.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          );
                        });
                      })()}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between items-center font-semibold text-gray-800">
                          <span>Total</span>
                          <span>
                            R$ {prepararDadosPizza('financeiro').reduce((sum, item) => sum + item.value, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={prepararDadosGraficos('financeiro')} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip 
                        formatter={(value, name) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, name]}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '2px solid #2F9C93',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      {programas.map((programa, index) => (
                        <Bar 
                          key={programa.id}
                          dataKey={programa.nome} 
                          fill={COLORS[index % COLORS.length]}
                          radius={[2, 2, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                )}
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
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#025C3E] text-white">
                      <th className="border border-gray-300 p-3 text-left font-semibold">Programa</th>
                      {anoSelecionado === 0 ? (
                        // Mostrar todos os anos
                        anos.map(ano => (
                          <th key={ano} className="border border-gray-300 p-3 text-center font-semibold min-w-[140px]">
                            {ano}<br />
                            <span className="text-xs font-normal">(Valor R$)</span>
                          </th>
                        ))
                      ) : (
                        // Mostrar apenas o ano selecionado
                        <th className="border border-gray-300 p-3 text-center font-semibold min-w-[140px]">
                          {anoSelecionado}<br />
                          <span className="text-xs font-normal">(Valor R$)</span>
                        </th>
                      )}
                      <th className="border border-gray-300 p-3 text-center font-semibold min-w-[150px]">
                        Total<br />
                        <span className="text-xs font-normal">(Aprovado R$)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {programas.map((programa, index) => (
                      <tr key={programa.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="border border-gray-300 p-3 font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            {programa.nome}
                          </div>
                        </td>
                        {anoSelecionado === 0 ? (
                          // Mostrar todos os anos
                          anos.map(ano => (
                            <td key={ano} className="border border-gray-300 p-3 text-center">
                              {(programa.valores_por_ano[ano] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                          ))
                        ) : (
                          // Mostrar apenas o ano selecionado
                          <td className="border border-gray-300 p-3 text-center">
                            {(programa.valores_por_ano[anoSelecionado] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                        )}
                        <td className="border border-gray-300 p-3 text-center font-bold text-[#025C3E]">
                          {programa.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                    
                    {/* Linha de Totais */}
                    <tr className="bg-[#025C3E] text-white font-bold">
                      <td className="border border-gray-300 p-3">TOTAL GERAL</td>
                      {anoSelecionado === 0 ? (
                        // Mostrar todos os anos
                        anos.map(ano => (
                          <td key={ano} className="border border-gray-300 p-3 text-center">
                            {(data.totais_gerais.valores_por_ano[ano] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                        ))
                      ) : (
                        // Mostrar apenas o ano selecionado
                        <td className="border border-gray-300 p-3 text-center">
                          {(data.totais_gerais.valores_por_ano[anoSelecionado] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      )}
                      <td className="border border-gray-300 p-3 text-center">
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
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#157A5B] text-white">
                      <th className="border border-gray-300 p-3 text-left font-semibold">Programa</th>
                      {anoSelecionado === 0 ? (
                        // Mostrar todos os anos
                        anos.map(ano => (
                          <th key={ano} className="border border-gray-300 p-3 text-center font-semibold min-w-[120px]">
                            {ano}<br />
                            <span className="text-xs font-normal">(Qtd)</span>
                          </th>
                        ))
                      ) : (
                        // Mostrar apenas o ano selecionado
                        <th className="border border-gray-300 p-3 text-center font-semibold min-w-[120px]">
                          {anoSelecionado}<br />
                          <span className="text-xs font-normal">(Qtd)</span>
                        </th>
                      )}
                      <th className="border border-gray-300 p-3 text-center font-semibold min-w-[150px]">
                        Total<br />
                        <span className="text-xs font-normal">(Projetos)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {programas.map((programa, index) => (
                      <tr key={programa.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="border border-gray-300 p-3 font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            {programa.nome}
                          </div>
                        </td>
                        {anoSelecionado === 0 ? (
                          // Mostrar todos os anos
                          anos.map(ano => (
                            <td key={ano} className="border border-gray-300 p-3 text-center">
                              {programa.projetos_por_ano[ano] || 0}
                            </td>
                          ))
                        ) : (
                          // Mostrar apenas o ano selecionado
                          <td className="border border-gray-300 p-3 text-center">
                            {programa.projetos_por_ano[anoSelecionado] || 0}
                          </td>
                        )}
                        <td className="border border-gray-300 p-3 text-center font-bold text-[#157A5B]">
                          {programa.total_projetos}
                        </td>
                      </tr>
                    ))}
                    
                    {/* Linha de Totais */}
                    <tr className="bg-[#157A5B] text-white font-bold">
                      <td className="border border-gray-300 p-3">TOTAL GERAL</td>
                      {anoSelecionado === 0 ? (
                        // Mostrar todos os anos
                        anos.map(ano => (
                          <td key={ano} className="border border-gray-300 p-3 text-center">
                            {data.totais_gerais.projetos_por_ano[ano] || 0}
                          </td>
                        ))
                      ) : (
                        // Mostrar apenas o ano selecionado
                        <td className="border border-gray-300 p-3 text-center">
                          {data.totais_gerais.projetos_por_ano[anoSelecionado] || 0}
                        </td>
                      )}
                      <td className="border border-gray-300 p-3 text-center">
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