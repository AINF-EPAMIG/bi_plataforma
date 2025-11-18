"use client";

import { useState, useEffect } from "react";
import AssignmentIcon from '@mui/icons-material/Assignment';
import TableChartIcon from '@mui/icons-material/TableChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
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
import AppSidebar from '@/components/AppSidebar';

// Tipos da página (dados financeiros dos programas)
interface ProgramaFinanceiro {
    id: number;
    programa: string;
    quantitativo: number;
    valorAprovado: number;
    valorFormatado: string;
    quantitativoEpamig: number;
    valorAprovadoEpamig: number;
    valorFormatadoEpamig: string;
}

interface FinanceiroData {
    programas: ProgramaFinanceiro[];
    totais: {
        quantitativo: number;
        valor: number;
        valorFormatado: string;
        quantitativoEpamig: number;
        valorEpamig: number;
        valorFormatadoEpamig: string;
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

    const handleExportExcel = async () => {
        try {
            const response = await fetch('/api/export/projetos/financeiro');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `projetos_financeiro_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Erro ao exportar para Excel:', error);
        }
    };

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

                <main className="p-2 md:p-3 lg:p-4 w-full max-w-full mx-auto overflow-x-hidden">
                    {/* Header da Página */}
                    <div className="mb-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-[#025C3E]">Projetos em Execução</h2>
                                <p className="text-xs text-gray-600 mt-0.5">Dados financeiros por programa de pesquisa</p>
                            </div>
                            
                            {/* Botões de Ação */}
                            {!loading && data && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleExportExcel}
                                        className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-md min-w-[160px]"
                                    >
                                        <FileDownloadIcon fontSize="small" />
                                        <span>Exportar para Excel</span>
                                    </button>

                                    <button
                                        onClick={() => setViewMode('grafico')}
                                        className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 min-w-[120px] ${
                                            viewMode === 'grafico'
                                                ? 'bg-[#025C3E] text-white shadow-lg'
                                                : 'bg-white text-[#025C3E] border-2 border-[#025C3E] hover:bg-[#E3F7EF]'
                                        }`}
                                    >
                                        <BarChartIcon fontSize="small" />
                                        <span>Gráfico</span>
                                    </button>

                                    <button
                                        onClick={() => setViewMode('tabela')}
                                        className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 min-w-[120px] ${
                                            viewMode === 'tabela'
                                                ? 'bg-[#025C3E] text-white shadow-lg'
                                                : 'bg-white text-[#025C3E] border-2 border-[#025C3E] hover:bg-[#E3F7EF]'
                                        }`}
                                    >
                                        <TableChartIcon fontSize="small" />
                                        <span>Tabela</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* KPIs Compactos */}
                        {!loading && data && (
                            <div className="mb-4">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                    <Card elevation={3} sx={{ borderRadius: 2 }}>
                                        <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                                            <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 1.5, bgcolor: 'primary.main', color: 'primary.contrastText', mb: 0.5 }} aria-hidden>
                                                    <AssignmentIcon sx={{ fontSize: 18 }} />
                                                </Box>
                                                <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3, fontSize: '0.6rem', lineHeight: 1.2 }}>
                                                    TOTAL DE PROJETOS
                                                </Typography>
                                                <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: '#000000', mt: 0.25, fontSize: '1rem' }} aria-label="Total de projetos">
                                                    {data.totais.quantitativo.toLocaleString('pt-BR')}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>

                                    <Card elevation={3} sx={{ borderRadius: 2 }}>
                                        <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                                            <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 1.5, bgcolor: 'success.main', color: 'success.contrastText', mb: 0.5 }} aria-hidden>
                                                    <AttachMoneyIcon sx={{ fontSize: 18 }} />
                                                </Box>
                                                <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3, fontSize: '0.6rem', lineHeight: 1.2 }}>
                                                    VALOR TOTAL APROVADO
                                                </Typography>
                                                <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: '#000000', mt: 0.25, fontSize: '0.95rem' }} aria-label="Valor total aprovado">
                                                    {data.totais.valorFormatado}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>

                                    <Card elevation={3} sx={{ borderRadius: 2 }}>
                                        <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                                            <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 1.5, bgcolor: '#025C3E', color: '#fff', mb: 0.5 }} aria-hidden>
                                                    <AssignmentIcon sx={{ fontSize: 18 }} />
                                                </Box>
                                                <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3, fontSize: '0.6rem', lineHeight: 1.2 }}>
                                                    PROJETOS COORD. EPAMIG
                                                </Typography>
                                                <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: '#025C3E', mt: 0.25, fontSize: '1rem' }} aria-label="Projetos coordenados pela EPAMIG">
                                                    {data.totais.quantitativoEpamig.toLocaleString('pt-BR')}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>

                                    <Card elevation={3} sx={{ borderRadius: 2 }}>
                                        <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                                            <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 1.5, bgcolor: '#025C3E', color: '#fff', mb: 0.5 }} aria-hidden>
                                                    <AttachMoneyIcon sx={{ fontSize: 18 }} />
                                                </Box>
                                                <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3, fontSize: '0.6rem', lineHeight: 1.2 }}>
                                                    VALOR COORD. EPAMIG
                                                </Typography>
                                                <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: '#025C3E', mt: 0.25, fontSize: '0.95rem' }} aria-label="Valor coordenado pela EPAMIG">
                                                    {data.totais.valorFormatadoEpamig}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="mt-3 flex gap-1.5 items-center flex-wrap">
                                    <button
                                        onClick={() => setMetric('quantitativo')}
                                        aria-pressed={metric === 'quantitativo'}
                                        className={`px-2 py-1 rounded-lg font-semibold text-xs transition-all flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#025C3E] focus-visible:ring-offset-2 ${metric === 'quantitativo' ? 'bg-[#025C3E] text-white shadow-md' : 'bg-white text-[#025C3E] border border-[#025C3E] hover:bg-[#E3F7EF]'}`}
                                        aria-label="Visualizar quantitativo de projetos por programa"
                                    >
                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 7h18M3 12h18M3 17h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        <span>Quantitativo</span>
                                    </button>
                                    <button
                                        onClick={() => setMetric('valor')}
                                        aria-pressed={metric === 'valor'}
                                        className={`px-2 py-1 rounded-lg font-semibold text-xs transition-all flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#025C3E] focus-visible:ring-offset-2 ${metric === 'valor' ? 'bg-[#025C3E] text-white shadow-md' : 'bg-white text-[#025C3E] border border-[#025C3E] hover:bg-[#E3F7EF]'}`}
                                        aria-label="Visualizar valor aprovado por programa"
                                    >
                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 1v22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="10" strokeWidth="2" /></svg>
                                        <span>Valor Aprovado</span>
                                    </button>
                                </div>
                            </div>
                        )}
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
                        <div className="space-y-2 md:space-y-3 mt-4">
                            {metric === 'quantitativo' ? (
                                <div className="bg-white rounded-xl shadow-md p-2 md:p-3">
                                    <h3 className="text-xs md:text-sm font-bold text-[#025C3E] mb-1.5 md:mb-2">Quantitativo de Projetos por Programa</h3>
                                    <div className="w-full overflow-x-auto">
                                        <div className="min-w-[320px]">
                                            <ResponsiveContainer width="100%" height={200}>
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
                                <div className="bg-white rounded-xl shadow-md p-2 md:p-3">
                                    <h3 className="text-xs md:text-sm font-bold text-[#025C3E] mb-1.5 md:mb-2">Valor Aprovado por Programa</h3>
                                    <div className="w-full overflow-x-auto">
                                        <div className="min-w-[320px]">
                                            <ResponsiveContainer width="100%" height={200}>
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
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-4">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr className="bg-[#025C3E] text-white">
                                        <th colSpan={5} className="px-3 md:px-4 py-3 text-center text-sm md:text-base font-bold">
                                            Projetos Em Execução - EPAMIG
                                        </th>
                                    </tr>
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
                                        <th className="px-3 md:px-4 py-3 text-center text-xs md:text-sm font-bold">
                                            Quantitativo - Coord EPAMIG
                                        </th>
                                        <th className="px-3 md:px-4 py-3 text-right text-xs md:text-sm font-bold">
                                            Valor Aprovado - Coord EPAMIG
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
                                            <td className="px-3 md:px-4 py-3 text-center text-xs md:text-sm font-semibold text-[#025C3E]">
                                                {programa.quantitativoEpamig}
                                            </td>
                                            <td className="px-3 md:px-4 py-3 text-right text-xs md:text-sm font-semibold text-gray-800">
                                                {programa.valorFormatadoEpamig}
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
                                        <td className="px-3 md:px-4 py-3 text-center text-xs md:text-sm">
                                            {data.totais.quantitativoEpamig}
                                        </td>
                                        <td className="px-3 md:px-4 py-3 text-right text-xs md:text-sm">
                                            {data.totais.valorFormatadoEpamig}
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
