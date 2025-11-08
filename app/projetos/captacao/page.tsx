"use client";

import { useState, useEffect, useMemo } from "react";
import Header from '@/components/header';
import AppSidebar from '@/components/AppSidebar';
import BarChartIcon from '@mui/icons-material/BarChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import { Card, CardContent, Typography, Select, MenuItem, InputLabel, FormControl, ListItemText, Checkbox, OutlinedInput, Chip, Box } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface UnidadeData {
  id: number;
  nome: string;
  captacao_por_ano: Record<number, { valor: number; projetos: number }>;
  total_captado: number;
  total_projetos: number;
}

interface AnoTotal {
  ano: number;
  total_captado: number;
  total_projetos: number;
}

interface ApiResponse {
  success: boolean;
  anos_selecionados: number[];
  unidades: UnidadeData[];
  totais_por_ano: AnoTotal[];
  total_geral_captado: number;
  total_geral_projetos: number;
  unidades_disponiveis: Array<{ id: number; nome: string }>;
  anos_disponiveis: number[];
  error?: string;
}

const COLORS: string[] = [
  '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
  '#3B82F6', '#8B5CF6', '#A855F7', '#EC4899',
  '#F59E0B', '#EF4444', '#84CC16', '#22C55E',
];

export default function CaptacaoPage() {
  const currentYear = new Date().getFullYear();
  const [selectedAnos, setSelectedAnos] = useState<number[]>([currentYear]);
  const [selectedUnidades, setSelectedUnidades] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grafico' | 'tabela' | 'pizza'>('grafico');
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dados da API quando filtros mudam
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (selectedAnos.length > 0) {
          params.set('anos', selectedAnos.join(','));
        }
        if (selectedUnidades.length > 0) {
          params.set('unidades', selectedUnidades.join(','));
        }
        const resp = await fetch(`/api/projetos/captacao?${params.toString()}`);
        const json: ApiResponse = await resp.json();
        if (!json.success) {
          setError(json.error || 'Falha ao carregar');
          setData(null);
        } else {
          setData(json);
        }
      } catch (e) {
        console.error('Erro ao buscar captação:', e);
        setError('Erro de rede');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedAnos, selectedUnidades]);

  // Dados formatados para gráfico de barras (comparação entre anos)
  const chartData = useMemo(() => {
    if (!data) return [];
    
    return data.unidades.map(unidade => {
      const dataPoint: Record<string, string | number> = { nome: unidade.nome };
      selectedAnos.forEach(ano => {
        const captacao = unidade.captacao_por_ano[ano];
        dataPoint[`${ano}`] = captacao ? captacao.valor : 0;
      });
      return dataPoint;
    });
  }, [data, selectedAnos]);

  // Dados para gráfico de pizza (total por unidade)
  const pieData = useMemo(() => {
    if (!data) return [];
    return data.unidades.map(u => ({
      name: u.nome,
      value: u.total_captado,
    }));
  }, [data]);

  const maxValue = useMemo(() => {
    if (!data) return 0;
    const allValues = data.unidades.flatMap(u => 
      selectedAnos.map(ano => u.captacao_por_ano[ano]?.valor || 0)
    );
    return Math.max(...allValues, 0);
  }, [data, selectedAnos]);

  const clearSelection = () => {
    setSelectedAnos([currentYear]);
    setSelectedUnidades([]);
  };

  // Formatação de valores monetários
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="flex min-h-screen bg-[#f6f8f9] overflow-x-hidden">
      <AppSidebar />
      <div className="flex-1 pl-16 md:pl-64 flex flex-col overflow-x-hidden">
        <Header />
        <main className="p-2 md:p-3 lg:p-4 w-full max-w-full mx-auto overflow-x-hidden">
          {/* Cabeçalho */}
          <div className="mb-3">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg md:text-xl font-bold text-[#025C3E]">Captação de Recursos</h2>
                <p className="text-xs text-gray-600 mt-0.5">Relatório de valores captados por unidade/regional - Comparação entre anos</p>
                {data && (
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2" aria-label="Indicadores principais">
                    <Card elevation={1} className="shadow-sm" sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ py: 0.75, px: 1.1, '&:last-child': { pb: 0.75 } }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.63rem', fontWeight: 600, letterSpacing: 0.3 }}>TOTAL CAPTADO</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.95rem', mt: 0.25 }}>{formatCurrency(data.total_geral_captado)}</Typography>
                      </CardContent>
                    </Card>
                    <Card elevation={1} className="shadow-sm" sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ py: 0.75, px: 1.1, '&:last-child': { pb: 0.75 } }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.63rem', fontWeight: 600, letterSpacing: 0.3 }}>ANOS</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.95rem', mt: 0.25 }}>{selectedAnos.join(', ')}</Typography>
                      </CardContent>
                    </Card>
                    <Card elevation={1} className="shadow-sm" sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ py: 0.75, px: 1.1, '&:last-child': { pb: 0.75 } }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.63rem', fontWeight: 600, letterSpacing: 0.3 }}>UNIDADES</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.95rem', mt: 0.25 }}>{data.unidades.length}</Typography>
                      </CardContent>
                    </Card>
                    <Card elevation={1} className="shadow-sm" sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ py: 0.75, px: 1.1, '&:last-child': { pb: 0.75 } }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.63rem', fontWeight: 600, letterSpacing: 0.3 }}>PROJETOS</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.95rem', mt: 0.25 }}>{data.total_geral_projetos}</Typography>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              {/* Controles principais */}
              <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grafico')}
                    className={`px-3 py-2 rounded-lg font-semibold text-xs md:text-sm flex items-center gap-1.5 transition ${viewMode === 'grafico' ? 'bg-[#025C3E] text-white shadow' : 'bg-white border border-[#025C3E] text-[#025C3E] hover:bg-[#E3F7EF]'}`}
                    aria-label="Modo gráfico barras"
                  >
                    <BarChartIcon fontSize="small" /> Barras
                  </button>
                  <button
                    onClick={() => setViewMode('pizza')}
                    className={`px-3 py-2 rounded-lg font-semibold text-xs md:text-sm flex items-center gap-1.5 transition ${viewMode === 'pizza' ? 'bg-[#025C3E] text-white shadow' : 'bg-white border border-[#025C3E] text-[#025C3E] hover:bg-[#E3F7EF]'}`}
                    aria-label="Modo gráfico pizza"
                  >
                    📊 Pizza
                  </button>
                  <button
                    onClick={() => setViewMode('tabela')}
                    className={`px-3 py-2 rounded-lg font-semibold text-xs md:text-sm flex items-center gap-1.5 transition ${viewMode === 'tabela' ? 'bg-[#025C3E] text-white shadow' : 'bg-white border border-[#025C3E] text-[#025C3E] hover:bg-[#E3F7EF]'}`}
                    aria-label="Modo tabela"
                  >
                    <TableChartIcon fontSize="small" /> Tabela
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-xl shadow-md p-3 mb-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Anos (Multi-select) */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#025C3E]">Anos (múltipla seleção)</label>
                <FormControl size="small" className="w-full">
                  <InputLabel id="anos-select-label">Selecionar</InputLabel>
                  <Select
                    labelId="anos-select-label"
                    multiple
                    value={selectedAnos}
                    onChange={(e) => setSelectedAnos(e.target.value as number[])}
                    input={<OutlinedInput label="Selecionar" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                        ))}
                      </Box>
                    )}
                    MenuProps={{ PaperProps: { style: { maxHeight: 280 } } }}
                    sx={{ minHeight: 36 }}
                  >
                    {data?.anos_disponiveis.map((ano) => (
                      <MenuItem key={ano} value={ano} dense>
                        <Checkbox checked={selectedAnos.indexOf(ano) > -1} size="small" />
                        <ListItemText primaryTypographyProps={{ fontSize: 13 }} primary={String(ano)} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Unidades (Multi-select) */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#025C3E]">Unidades/Regionais (múltipla seleção)</label>
                <FormControl size="small" className="w-full">
                  <InputLabel id="unidades-select-label">Todas</InputLabel>
                  <Select
                    labelId="unidades-select-label"
                    multiple
                    value={selectedUnidades}
                    onChange={(e) => setSelectedUnidades(e.target.value as number[])}
                    input={<OutlinedInput label="Todas" />}
                    renderValue={(selected) => {
                      if (selected.length === 0) return 'Todas';
                      return (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.slice(0, 2).map((value) => {
                            const unidade = data?.unidades_disponiveis.find(u => u.id === value);
                            return (
                              <Chip key={value} label={unidade?.nome.substring(0, 10) || value} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                            );
                          })}
                          {selected.length > 2 && <Chip label={`+${selected.length - 2}`} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />}
                        </Box>
                      );
                    }}
                    MenuProps={{ PaperProps: { style: { maxHeight: 280 } } }}
                    sx={{ minHeight: 36 }}
                  >
                    {data?.unidades_disponiveis.map((unidade) => (
                      <MenuItem key={unidade.id} value={unidade.id} dense>
                        <Checkbox checked={selectedUnidades.indexOf(unidade.id) > -1} size="small" />
                        <ListItemText primaryTypographyProps={{ fontSize: 13 }} primary={unidade.nome} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Ações */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#025C3E]">Ações</label>
                <button
                  onClick={clearSelection}
                  className="px-2 py-1 text-xs rounded border transition w-full h-[36px] bg-[#025C3E] text-white border-[#025C3E] hover:bg-[#038451]"
                >Limpar filtros</button>
              </div>
            </div>
          </div>

          {/* Estados */}
          {loading && (
            <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-8 bg-gray-100 rounded" />
                ))}
              </div>
            </div>
          )}
          {!loading && error && (
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Visualização Gráfico de Barras */}
          {!loading && !error && data && viewMode === 'grafico' && (
            <div className="bg-white rounded-xl shadow-md p-3">
              <h3 className="text-xs md:text-sm font-bold text-[#025C3E] mb-2">
                Comparação de Captação entre Anos - {selectedAnos.join(', ')}
              </h3>
              <div className="w-full overflow-x-auto">
                <div className="min-w-[320px]">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 100 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="nome" 
                        interval={0} 
                        angle={-40} 
                        textAnchor="end" 
                        height={110} 
                        tick={{ fontSize: 9, fill: '#274749', fontWeight: 600 }} 
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#6B7280' }}
                        label={{ value: 'Valor Captado (R$)', angle: -90, position: 'insideLeft', style: { fill: '#6B7280', fontSize: 11, fontWeight: 600 } }}
                        domain={[0, maxValue * 1.1]}
                        tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(2,92,62,0.06)' }}
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #025C3E', borderRadius: 8, padding: '6px 8px' }}
                        formatter={(value: number, name) => [formatCurrency(value), `Ano ${name}`]}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      {selectedAnos.map((ano, idx) => (
                        <Bar
                          key={ano}
                          dataKey={String(ano)}
                          name={String(ano)}
                          fill={COLORS[idx % COLORS.length]}
                          radius={[4, 4, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Visualização Gráfico de Pizza */}
          {!loading && !error && data && viewMode === 'pizza' && (
            <div className="bg-white rounded-xl shadow-md p-3">
              <h3 className="text-xs md:text-sm font-bold text-[#025C3E] mb-2">
                Distribuição Total de Captação por Unidade - Anos: {selectedAnos.join(', ')}
              </h3>
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Visualização Tabela */}
          {!loading && !error && data && viewMode === 'tabela' && (
            <div className="bg-white rounded-xl shadow-md overflow-auto">
              <table className="min-w-full text-xs md:text-sm">
                <thead>
                  <tr className="bg-[#025C3E] text-white">
                    <th className="px-3 py-2 text-left font-semibold sticky left-0 bg-[#025C3E] z-10">Unidade</th>
                    {selectedAnos.map(ano => (
                      <th key={`th-${ano}`} className="px-3 py-2 text-center font-semibold whitespace-nowrap">
                        {ano}
                        <br />
                        <span className="text-[0.65rem] font-normal">(Valor / Proj)</span>
                      </th>
                    ))}
                    <th className="px-3 py-2 text-center font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.unidades.map((u, idx) => (
                    <tr key={idx} className="hover:bg-[#E3F7EF]">
                      <td className="px-3 py-2 font-medium text-gray-800 sticky left-0 bg-white z-5">{u.nome}</td>
                      {selectedAnos.map(ano => {
                        const captacao = u.captacao_por_ano[ano];
                        return (
                          <td key={`td-${idx}-${ano}`} className="px-3 py-2 text-center whitespace-nowrap">
                            {captacao ? (
                              <>
                                {formatCurrency(captacao.valor)}
                                <br />
                                <span className="text-[0.7rem] text-gray-500">({captacao.projetos})</span>
                              </>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-3 py-2 text-center font-semibold whitespace-nowrap">
                        {formatCurrency(u.total_captado)}
                        <br />
                        <span className="text-[0.7rem] text-gray-500">({u.total_projetos})</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#025C3E] text-white font-bold">
                    <td className="px-3 py-2 sticky left-0 bg-[#025C3E] z-10">Total Geral</td>
                    {data.totais_por_ano.map(total => (
                      <td key={`total-${total.ano}`} className="px-3 py-2 text-center whitespace-nowrap">
                        {formatCurrency(total.total_captado)}
                        <br />
                        <span className="text-[0.75rem] font-normal">({total.total_projetos})</span>
                      </td>
                    ))}
                    <td className="px-3 py-2 text-center whitespace-nowrap">
                      {formatCurrency(data.total_geral_captado)}
                      <br />
                      <span className="text-[0.75rem] font-normal">({data.total_geral_projetos})</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
