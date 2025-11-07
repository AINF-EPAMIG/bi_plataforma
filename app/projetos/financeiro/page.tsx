"use client";

import { useState, useEffect } from "react";
import AssignmentIcon from '@mui/icons-material/Assignment';
import TableChartIcon from '@mui/icons-material/TableChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Card, CardContent, Typography, Box } from '@mui/material';
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
import Header from '@/components/header';
import Stack from '@mui/material/Stack';
import AppSidebar from '@/components/AppSidebar';

// Tipos da página (dados financeiros dos programas)
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

// Paleta de cores para os gráficos (12 cores)
const COLORS: string[] = [
    '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
    '#3B82F6', '#8B5CF6', '#A855F7', '#EC4899',
    '#F59E0B', '#EF4444', '#84CC16', '#06B6D4'
] as const;

export default function ProjetosFinanceiro() {
    const [data, setData] = useState<FinanceiroData | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'tabela' | 'grafico'>('grafico');
    const [metric, setMetric] = useState<'quantitativo' | 'valor'>('quantitativo');

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const response = await fetch('/api/projetos/financeiro');
                const result = await response.json() as { success: boolean } & FinanceiroData;

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
    type ChartItem = { nome: string; nomeCompleto: string; valor: number };
    const chartDataQuantitativo = data ? data.programas.map(p => ({
        nome: p.programa.length > 12 ? p.programa.substring(0, 12) + '…' : p.programa,
        nomeCompleto: p.programa,
        valor: p.quantitativo
    })) as ChartItem[] : [];

    const chartDataValor = data ? data.programas.map(p => ({
        nome: p.programa.length > 12 ? p.programa.substring(0, 12) + '…' : p.programa,
        nomeCompleto: p.programa,
        valor: p.valorAprovado
    })) as ChartItem[] : [];

    // CUSTOM TICK: usa os dados do gráfico para mostrar tooltip com nome completo
    const createCustomTick = (chartData: ChartItem[]) => {
        return function CustomTick(props: { x?: number; y?: number; payload?: { value: string } }) {
            const { x = 0, y = 0, payload } = props;
            const short = payload?.value ?? '';
            const match = chartData.find((d) => d.nome === short || d.nomeCompleto === short);
            const full = match ? match.nomeCompleto : short;
            return (
                <g transform={`translate(${x},${y})`}>
                    <text x={0} y={0} dy={16} textAnchor="end" fill="#274749" fontSize={10} fontWeight={700} style={{ cursor: 'default' }}>
                        <title>{full}</title>
                        {short}
                    </text>
                </g>
            );
        };
    };

    return (
        <div className="flex min-h-screen bg-[#f6f8f9] overflow-x-hidden">
            <AppSidebar />
            {/* HEADER FIXO + Main */}
            <div className="flex-1 pl-16 md:pl-64 flex flex-col overflow-x-hidden">
                {/* Shared Header */}
                <Header />

                <main className="p-4 md:p-6 lg:p-8 w-full max-w-[1600px] mx-auto">
                    {/* Header da Página */}
                    <div className="mb-6 md:mb-8">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                                <h2 className="text-xl md:text-2xl font-bold text-[#025C3E]">Projetos em Execução</h2>
                                <p className="text-xs md:text-sm text-gray-600 mt-1">Dados financeiros por programa de pesquisa</p>
                                {/* KPIs Compactos */}
                                {!loading && data && (
                                    <div className="mt-3" aria-label="Indicadores principais">
                                        <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} className="mb-3">
                                            <Card elevation={3} sx={{ borderRadius: 2, flex: 1 }}>
                                                <CardContent>
                                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                                        <Box>
                                                            <Typography variant="subtitle2" color="text.secondary" sx={{ letterSpacing: 0.4 }}>TOTAL DE PROJETOS</Typography>
                                                            <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: 'primary.main', mt: 0.5 }} aria-label="Total de projetos">{data.totais.quantitativo.toLocaleString('pt-BR')}</Typography>
                                                        </Box>
                                                        <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 1.5, bgcolor: 'primary.main', color: 'primary.contrastText' }} aria-hidden>
                                                            <AssignmentIcon />
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                            <Card elevation={3} sx={{ borderRadius: 2, flex: 1 }}>
                                                <CardContent>
                                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                                        <Box>
                                                            <Typography variant="subtitle2" color="text.secondary" sx={{ letterSpacing: 0.4 }}>VALOR TOTAL APROVADO</Typography>
                                                            <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: 'primary.main', mt: 0.5 }} aria-label="Valor total aprovado">{data.totais.valorFormatado}</Typography>
                                                        </Box>
                                                        <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 1.5, bgcolor: 'success.main', color: 'success.contrastText' }} aria-hidden>
                                                            <AttachMoneyIcon />
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Stack>
                                        <div className="w-full mt-4 flex gap-2 items-center">
                                            <button
                                                onClick={() => setMetric('quantitativo')}
                                                aria-pressed={metric === 'quantitativo'}
                                                className={`px-3 md:px-4 py-2 rounded-lg font-semibold text-xs md:text-sm transition-all flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#025C3E] focus-visible:ring-offset-2 ${metric === 'quantitativo' ? 'bg-[#025C3E] text-white shadow-md' : 'bg-white text-[#025C3E] border border-[#025C3E] hover:bg-[#E3F7EF]'}`}
                                                aria-label="Visualizar quantitativo de projetos por programa"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 7h18M3 12h18M3 17h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                <span>Quantitativo</span>
                                            </button>
                                            <button
                                                onClick={() => setMetric('valor')}
                                                aria-pressed={metric === 'valor'}
                                                className={`px-3 md:px-4 py-2 rounded-lg font-semibold text-xs md:text-sm transition-all flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#025C3E] focus-visible:ring-offset-2 ${metric === 'valor' ? 'bg-[#025C3E] text-white shadow-md' : 'bg-white text-[#025C3E] border border-[#025C3E] hover:bg-[#E3F7EF]'}`}
                                                aria-label="Visualizar valor aprovado por programa"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 1v22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="10" strokeWidth="2" /></svg>
                                                <span>Valor Aprovado</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

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
                        <div className="space-y-3 md:space-y-4">
                            {metric === 'quantitativo' ? (
                                <div className="bg-white rounded-xl shadow-md p-3 md:p-4 lg:p-5">
                                    <h3 className="text-xs md:text-sm lg:text-base font-bold text-[#025C3E] mb-2 md:mb-2.5">Quantitativo de Projetos por Programa</h3>
                                    <div className="w-full overflow-x-auto">
                                        <div className="min-w-[320px]">
                                            <ResponsiveContainer width="100%" height={240}>
                                                <BarChart data={chartDataQuantitativo} margin={{ top: 8, right: 8, left: 0, bottom: 60 }}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                                    <XAxis dataKey="nome" angle={-35} textAnchor="end" height={70} interval={0} tick={createCustomTick(chartDataQuantitativo)} />
                                                    <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} label={{ value: "Nº Proj.", angle: -90, position: "insideLeft", style: { fill: "#6B7280", fontWeight: 600, fontSize: 11 } }} />
                                                    <Tooltip cursor={{ fill: "rgba(2,92,62,0.08)" }} contentStyle={{ backgroundColor: '#fff', border: '1px solid #025C3E', borderRadius: '8px', padding: '6px 8px' }} formatter={(value: number) => [`${value} projetos`, 'Quantidade']} labelFormatter={(label, payload) => payload?.[0]?.payload?.nomeCompleto || label} />
                                                    <Bar dataKey="valor" radius={[5,5,0,0]} label={{ position: 'top', fill: '#025C3E', fontSize: 10, fontWeight: '600' }}>
                                                        {chartDataQuantitativo.map((entry, index) => (
                                                            <Cell key={`cell-qtd-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-md p-3 md:p-4 lg:p-5">
                                    <h3 className="text-xs md:text-sm lg:text-base font-bold text-[#025C3E] mb-2 md:mb-2.5">Valor Aprovado por Programa</h3>
                                    <div className="w-full overflow-x-auto">
                                        <div className="min-w-[320px]">
                                            <ResponsiveContainer width="100%" height={240}>
                                                <BarChart data={chartDataValor} margin={{ top: 8, right: 8, left: 0, bottom: 60 }}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                                    <XAxis dataKey="nome" angle={-35} textAnchor="end" height={70} interval={0} tick={createCustomTick(chartDataValor)} />
                                                    <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { notation: 'compact', compactDisplay: 'short', style: 'currency', currency: 'BRL' }).format(value)} label={{ value: "Valor (R$)", angle: -90, position: "insideLeft", style: { fill: "#6B7280", fontWeight: 600, fontSize: 11 } }} />
                                                    <Tooltip cursor={{ fill: "rgba(2,92,62,0.08)" }} contentStyle={{ backgroundColor: '#fff', border: '1px solid #025C3E', borderRadius: '8px', padding: '6px 8px' }} formatter={(value: number) => [new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value), 'Valor Aprovado']} labelFormatter={(label, payload) => payload?.[0]?.payload?.nomeCompleto || label} />
                                                    <Bar dataKey="valor" radius={[5,5,0,0]} label={{ position: 'top', fill: '#025C3E', fontSize: 9, fontWeight: '600', formatter: (value: number) => new Intl.NumberFormat('pt-BR', { notation: 'compact', compactDisplay: 'short' }).format(value) }}>
                                                        {chartDataValor.map((entry, index) => (
                                                            <Cell key={`cell-val-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            )}
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
