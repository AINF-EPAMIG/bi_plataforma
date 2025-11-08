"use client";

import { useState, useEffect, useMemo } from "react";
import Header from '@/components/header';
import AppSidebar from '@/components/AppSidebar';
import BarChartIcon from '@mui/icons-material/BarChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Card, CardContent, Typography, Select, MenuItem, InputLabel, FormControl, ListItemText } from '@mui/material';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";

interface ProgramaProjecao {
	id: number;
	nome: string;
	valores_por_ano: Record<number, number>;
	projetos_por_ano: Record<number, number>;
	valor_total: number;
	total_projetos: number;
}

interface ApiResponse {
	success: boolean;
	anos: number[];
	programas: ProgramaProjecao[];
	totais_gerais: {
		valores_por_ano: Record<number, number>;
		projetos_por_ano: Record<number, number>;
		valor_total_geral: number;
		total_projetos_geral: number;
	};
	range: { inicio: number; fim: number };
	error?: string;
}

type Metric = 'valor' | 'quantidade';

const COLORS: string[] = [
	'#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
	'#3B82F6', '#8B5CF6', '#A855F7', '#EC4899',
	'#F59E0B', '#EF4444', '#84CC16', '#06B6D4',
];

export default function ProjecaoPage() {
	const currentYear = new Date().getFullYear();
	const [startYear, setStartYear] = useState(currentYear);
	const [endYear, setEndYear] = useState(currentYear + 4);
	const [metric, setMetric] = useState<Metric>('valor');
	const [viewMode, setViewMode] = useState<'grafico' | 'tabela'>('grafico');
	const [data, setData] = useState<ApiResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	// Programa selecionado (apenas um)
	const [selectedPrograma, setSelectedPrograma] = useState<number | ''>('');

	// Fetch dados da API quando filtros mudam
	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);
				setError(null);
				const params = new URLSearchParams();
				params.set('startYear', String(startYear));
				params.set('endYear', String(endYear));
				if (selectedPrograma) params.set('programaIds', String(selectedPrograma));
				const resp = await fetch(`/api/projetos/projecao?${params.toString()}`);
				const json: ApiResponse = await resp.json();
				if (!json.success) {
					setError(json.error || 'Falha ao carregar');
					setData(null);
				} else {
					setData(json);
				}
			} catch (e) {
				console.error('Erro ao buscar projeção:', e);
				setError('Erro de rede');
			} finally {
				setLoading(false);
			}
		}
		fetchData();
		}, [startYear, endYear, selectedPrograma]);

	// Programas filtrados para exibição
		const programasExibidos = useMemo(() => {
			if (!data) return [] as ProgramaProjecao[];
			const list = selectedPrograma
				? data.programas.filter(p => p.id === selectedPrograma)
				: data.programas;
			return list.sort((a, b) => a.nome.localeCompare(b.nome));
		}, [data, selectedPrograma]);

	// Construção de série comparativa por ano para cada programa
	const chartData = useMemo(() => {
		if (!data) return [] as Array<Record<string, unknown>>;
		// Cada ano vira um objeto com valores por programa (para barras agrupadas) - mas Recharts lida melhor com cada programa como item e anos como múltiplas barras
		// Então pivot: item = programa, chaves = ano_metric
		return programasExibidos.map(prog => {
			const base: Record<string, unknown> = { programa: prog.nome };
			data.anos.forEach(ano => {
				const valorAno = metric === 'valor' ? (prog.valores_por_ano[ano] || 0) : (prog.projetos_por_ano[ano] || 0);
				base[String(ano)] = valorAno;
			});
			return base;
		});
	}, [data, programasExibidos, metric]);

	// Valores máximos para escala
	const maxValue = useMemo(() => {
		if (!data) return 0;
		return Math.max(
			...data.anos.flatMap(ano => programasExibidos.map(p => metric === 'valor' ? (p.valores_por_ano[ano] || 0) : (p.projetos_por_ano[ano] || 0)))
		);
	}, [data, programasExibidos, metric]);

	// Formatação condicional da escala monetária
	const formatCurrencyCompact = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', compactDisplay: 'short' }).format(v);
	const formatCurrencyFull = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

	const clearSelection = () => setSelectedPrograma('');

		// Lista de programas ordenada por nome (para o dropdown)
		const programasOrdenados = useMemo(() => {
			return (data?.programas || [])
				.slice()
				.sort((a, b) => a.nome.localeCompare(b.nome));
		}, [data]);

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
								<h2 className="text-lg md:text-xl font-bold text-[#025C3E]">Projeção de Programas</h2>
								<p className="text-xs text-gray-600 mt-0.5">Comparativo entre anos dos valores aprovados e quantitativo de projetos</p>
								{data && (
									<div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2" aria-label="Indicadores principais">
										<Card elevation={1} className="shadow-sm" sx={{ borderRadius: 2 }}>
											<CardContent sx={{ py: 0.75, px: 1.1, '&:last-child': { pb: 0.75 } }}>
												<Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.63rem', fontWeight: 600, letterSpacing: 0.3 }}>TOTAL PROJETOS</Typography>
												<Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.95rem', mt: 0.25 }}>{data.totais_gerais.total_projetos_geral.toLocaleString('pt-BR')}</Typography>
											</CardContent>
										</Card>
										<Card elevation={1} className="shadow-sm" sx={{ borderRadius: 2 }}>
											<CardContent sx={{ py: 0.75, px: 1.1, '&:last-child': { pb: 0.75 } }}>
												<Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.63rem', fontWeight: 600, letterSpacing: 0.3 }}>VALOR TOTAL</Typography>
												<Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.95rem', mt: 0.25 }}>{formatCurrencyFull(data.totais_gerais.valor_total_geral)}</Typography>
											</CardContent>
										</Card>
										<Card elevation={1} className="shadow-sm" sx={{ borderRadius: 2 }}>
											<CardContent sx={{ py: 0.75, px: 1.1, '&:last-child': { pb: 0.75 } }}>
												<Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.63rem', fontWeight: 600, letterSpacing: 0.3 }}>ANOS</Typography>
												<Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.95rem', mt: 0.25 }}>{startYear} - {endYear}</Typography>
											</CardContent>
										</Card>
										<Card elevation={1} className="shadow-sm" sx={{ borderRadius: 2 }}>
											<CardContent sx={{ py: 0.75, px: 1.1, '&:last-child': { pb: 0.75 } }}>
												<Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.63rem', fontWeight: 600, letterSpacing: 0.3 }}>PROGRAMAS</Typography>
												<Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.95rem', mt: 0.25 }}>{programasExibidos.length}</Typography>
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
										aria-label="Modo gráfico"
									>
										<BarChartIcon fontSize="small" /> Gráfico
									</button>
									<button
										onClick={() => setViewMode('tabela')}
										className={`px-3 py-2 rounded-lg font-semibold text-xs md:text-sm flex items-center gap-1.5 transition ${viewMode === 'tabela' ? 'bg-[#025C3E] text-white shadow' : 'bg-white border border-[#025C3E] text-[#025C3E] hover:bg-[#E3F7EF]'}`}
										aria-label="Modo tabela"
									>
										<TableChartIcon fontSize="small" /> Tabela
									</button>
								</div>
								<div className="flex gap-2">
									<button
										onClick={() => setMetric('valor')}
										className={`px-3 py-2 rounded-lg font-semibold text-xs md:text-sm flex items-center gap-1.5 transition ${metric === 'valor' ? 'bg-[#025C3E] text-white shadow' : 'bg-white border border-[#025C3E] text-[#025C3E] hover:bg-[#E3F7EF]'}`}
										aria-label="Métrica valor"
									>
										<AttachMoneyIcon fontSize="small" /> Valor
									</button>
									<button
										onClick={() => setMetric('quantidade')}
										className={`px-3 py-2 rounded-lg font-semibold text-xs md:text-sm flex items-center gap-1.5 transition ${metric === 'quantidade' ? 'bg-[#025C3E] text-white shadow' : 'bg-white border border-[#025C3E] text-[#025C3E] hover:bg-[#E3F7EF]'}`}
										aria-label="Métrica quantidade"
									>
										<AssignmentIcon fontSize="small" /> Quantidade
									</button>
								</div>
							</div>
						</div>
					</div>

					{/* Filtros secundários */}
								<div className="bg-white rounded-xl shadow-md p-3 mb-3">
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
										{/* Ano Inicial */}
										<div className="flex flex-col gap-1">
											<label className="text-xs font-semibold text-[#025C3E]">Ano Inicial</label>
											<input
												type="number"
												min={currentYear - 10}
												max={endYear}
												value={startYear}
												onChange={e => setStartYear(parseInt(e.target.value) || currentYear)}
												className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#025C3E] w-full"
											/>
										</div>
										{/* Ano Final */}
										<div className="flex flex-col gap-1">
											<label className="text-xs font-semibold text-[#025C3E]">Ano Final</label>
											<input
												type="number"
												min={startYear}
												max={currentYear + 10}
												value={endYear}
												onChange={e => setEndYear(parseInt(e.target.value) || (currentYear + 4))}
												className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#025C3E] w-full"
											/>
										</div>
										{/* Programas Dropdown (seleção única, mesma altura dos anos) */}
														<div className="flex flex-col gap-1">
											<label className="text-xs font-semibold text-[#025C3E]">Programas</label>
											<FormControl size="small" className="w-full">
												<InputLabel id="programas-select-label">Selecionar</InputLabel>
												<Select
													labelId="programas-select-label"
													value={selectedPrograma}
													label="Selecionar"
													onChange={(e) => {
														const value = e.target.value as number | '';
														setSelectedPrograma(value);
													}}
													renderValue={(value) => {
														const selected = value as number | '';
														if (!data || selected === '') return '';
														const found = data.programas.find(p => p.id === selected);
														return found ? found.nome : '';
													}}
													MenuProps={{ PaperProps: { style: { maxHeight: 280 } } }}
													sx={{ maxHeight: 42 }}
												>
													{programasOrdenados.map((p) => (
														<MenuItem key={p.id} value={p.id} dense>
															<ListItemText primaryTypographyProps={{ fontSize: 13 }} primary={p.nome} />
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
												disabled={!selectedPrograma}
												className={`px-2 py-1 text-xs rounded border transition w-full ${selectedPrograma ? 'bg-[#025C3E] text-white border-[#025C3E] hover:bg-[#038451]' : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'}`}
											>Limpar seleção</button>
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

					{/* Visualização Gráfico */}
					{!loading && !error && data && viewMode === 'grafico' && (
						<div className="bg-white rounded-xl shadow-md p-3">
							<h3 className="text-xs md:text-sm font-bold text-[#025C3E] mb-2">Comparativo {metric === 'valor' ? 'Valor Aprovado (R$)' : 'Quantidade de Projetos'} por Programa e Ano</h3>
							<div className="w-full overflow-x-auto">
								<div className="min-w-[320px]">
									<ResponsiveContainer width="100%" height={360}>
										<BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 50 }}>
											<CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
											<XAxis dataKey="programa" interval={0} angle={-30} textAnchor="end" height={70} tick={{ fontSize: 10, fill: '#274749', fontWeight: 600 }} />
											<YAxis
												tick={{ fontSize: 11, fill: '#6B7280' }}
												tickFormatter={metric === 'valor' ? (v) => formatCurrencyCompact(Number(v)) : (v) => String(v)}
												label={{ value: metric === 'valor' ? 'Valor (R$)' : 'Qtd', angle: -90, position: 'insideLeft', style: { fill: '#6B7280', fontSize: 11, fontWeight: 600 } }}
												domain={[0, maxValue * 1.1]}
											/>
											<Tooltip
												cursor={{ fill: 'rgba(2,92,62,0.06)' }}
												contentStyle={{ backgroundColor: '#fff', border: '1px solid #025C3E', borderRadius: 8, padding: '6px 8px' }}
												formatter={(value: number, name) => [
													metric === 'valor' ? formatCurrencyFull(value) : `${value} projetos`,
													String(name)
												]}
											/>
											<Legend wrapperStyle={{ fontSize: 11 }} />
											{data.anos.map((ano, idx) => (
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

					{/* Visualização Tabela */}
					{!loading && !error && data && viewMode === 'tabela' && (
						<div className="bg-white rounded-xl shadow-md overflow-auto">
							<table className="min-w-full text-xs md:text-sm">
								<thead>
									<tr className="bg-[#025C3E] text-white">
										<th className="px-3 py-2 text-left font-semibold">Programa</th>
										{data.anos.map(ano => (
											<th key={`th-val-${ano}`} className="px-3 py-2 text-right font-semibold">{ano} {metric === 'valor' ? '(R$)' : '(Qtd)'}</th>
										))}
										<th className="px-3 py-2 text-right font-semibold">Total {metric === 'valor' ? '(R$)' : '(Qtd)'}</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{programasExibidos.map(p => {
										const total = metric === 'valor' ? p.valor_total : p.total_projetos;
										return (
											<tr key={p.id} className="hover:bg-[#E3F7EF]">
												<td className="px-3 py-2 font-medium text-gray-800">{p.nome}</td>
												{data.anos.map(ano => (
													<td key={`td-${p.id}-${ano}`} className="px-3 py-2 text-right whitespace-nowrap">
														{metric === 'valor'
															? formatCurrencyFull(p.valores_por_ano[ano] || 0)
															: (p.projetos_por_ano[ano] || 0)}
													</td>
												))}
												<td className="px-3 py-2 text-right font-semibold">
													{metric === 'valor' ? formatCurrencyFull(total) : total}
												</td>
											</tr>
										);
									})}
									<tr className="bg-[#025C3E] text-white font-bold">
										<td className="px-3 py-2">TOTAL</td>
										{data.anos.map(ano => (
											<td key={`total-${ano}`} className="px-3 py-2 text-right">
												{metric === 'valor'
													? formatCurrencyFull(data.totais_gerais.valores_por_ano[ano] || 0)
													: (data.totais_gerais.projetos_por_ano[ano] || 0)}
											</td>
										))}
										<td className="px-3 py-2 text-right">
											{metric === 'valor'
												? formatCurrencyFull(data.totais_gerais.valor_total_geral)
												: data.totais_gerais.total_projetos_geral}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}

