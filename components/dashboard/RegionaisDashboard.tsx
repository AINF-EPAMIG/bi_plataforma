'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RegionalData {
  id: number;
  nome: string;
  total: number;
}

interface FazendaData {
  id: number;
  nome_fazenda: string;
  sigla_fazenda: string; // Adicionado para usar como label
  nome_regional: string;
  total: number;
}

interface DashboardData {
  success: boolean;
  regionais: RegionalData[];
  totalGeral: number;
}

interface FazendasData {
  success: boolean;
  fazendas: FazendaData[];
  totalGeral: number;
}

// Paleta diversificada inspirada no Power BI e institucional
const COLORS = [
  '#025C3E', // Verde institucional
 '#FF9800', // Laranja vibrante (contraste forte, ótimo para alertas/destaques)
'#FFC107', // Amarelo ouro (ótimo para indicadores de desempenho)
'#1976D2', // Azul médio (equilíbrio e profissionalismo, bom em dashboards)
'#455A64', // Cinza azulado (neutro, ajuda a equilibrar cores fortes)
  '#F9C846', // Amarelo Power BI
  '#F39200', // Laranja Power BI
  '#E94F37', // Vermelho institucional
  '#5C6BC0', // Azul institucional
  '#0081A7', // Azul claro
  '#6BC3DA', // Azul água
  '#A259F7', // Roxo Power BI
  '#F7B2B7', // Rosa claro
  '#FFB400', // Amarelo institucional
  '#00BFAE', // Verde institucional claro
];

export default function RegionaisDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [fazendasData, setFazendasData] = useState<FazendasData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar dados das regionais
        const regionaisResponse = await fetch('/api/dashboard/regionais');
        const regionaisResult = await regionaisResponse.json();
        
        // Buscar dados das fazendas
        const fazendasResponse = await fetch('/api/dashboard/fazendas');
        const fazendasResult = await fazendasResponse.json();
        
        if (regionaisResult.success) {
          setData(regionaisResult);
        } else {
          setError(regionaisResult.error || 'Erro ao carregar dados das regionais');
        }

        if (fazendasResult.success) {
          setFazendasData(fazendasResult);
        } else {
          console.warn('Erro ao carregar dados das fazendas:', fazendasResult.error);
        }
      } catch {
        setError('Erro de conexão com o servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-200 rounded"></div>
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

  // Cards institucionais no topo (incluindo total de pesquisadores)
  const cardsResumo = [
    {
      label: 'Regionais',
      value: 5,
      color: '#025C3E',
      desc: 'Unidades Regionais'
    },
    {
      label: 'Instituições de Ensino',
      value: 2,
      color: '#F9C846',
      desc: 'Institutos Tecnológicos'
    },
    {
      label: 'Campos Experimentais',
      value: 21,
      color: '#F39200',
      desc: 'Campos experimentais ativos'
    },
    {
      label: 'Pesquisadores Ativos',
      value: data?.totalGeral || 0,
      color: '#223A5E', // Azul marinho institucional
      desc: 'Total de pesquisadores'
    }
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Cards institucionais sem gradiente, sombra ou ícone - AGORA 4 CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        {cardsResumo.map((card) => (
          <div
            key={card.label}
            className="flex flex-col items-center justify-center rounded-xl py-6 px-4"
            style={{
              background: card.color
            }}
          >
            <div className="text-3xl font-extrabold text-white">{card.value}</div>
            <div className="text-base font-bold text-white mt-1">{card.label}</div>
            <div className="text-xs text-white/80 mt-1">{card.desc}</div>
          </div>
        ))}
      </div>

      {/* Card ÚNICO - Proporção por Regional COM GRÁFICO E LEGENDA MINIMALISTA */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-xl flex items-center gap-2">
            <div className="w-2 h-2 bg-[#157A5B] rounded-full"></div>
            Proporção por Regional
          </CardTitle>
          <CardDescription className="text-sm">Percentual de distribuição</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Gráfico de Pizza */}
            <div className="w-full lg:w-2/3">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={data.regionais}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                    outerRadius={window.innerWidth < 640 ? 60 : 80}
                    fill="#8884d8"
                    dataKey="total"
                  >
                    {data.regionais.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [value, 'Pesquisadores']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #157A5B',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legenda minimalista */}
            <div className="w-full lg:w-1/3 flex flex-col gap-2 mt-4 lg:mt-0">
              {data.regionais.map((regional, index) => (
                <div key={regional.id} className="flex items-center gap-2 text-sm">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>
                  <span className="font-medium text-gray-700 truncate max-w-[120px]">{regional.nome}</span>
                  <span className="ml-auto text-gray-500 font-semibold">{regional.total}</span>
                  <span className="ml-2 text-xs text-gray-400">
                    {data.totalGeral > 0 ? ((regional.total / data.totalGeral) * 100).toFixed(1) : '0.0'}%
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-2 border-t pt-2 mt-2 text-sm font-bold text-[#223A5E]">
                <span>Total</span>
                <span className="ml-auto">{data.totalGeral}</span>
                <span className="ml-2 text-xs text-gray-400">100%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card ÚNICO - Distribuição por Campo Experimental COM GRÁFICO E TABELA INTEGRADOS */}
      {fazendasData && fazendasData.fazendas.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <div className="w-2 h-2 bg-[#F39200] rounded-full"></div>
              Distribuição por Campo Experimental
            </CardTitle>
            <CardDescription className="text-sm">Quantidade de pesquisadores por campo experimental e totalizador detalhado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Barras */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Visualização Gráfica</h4>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={fazendasData.fazendas}
                    margin={{ top: 5, right: 10, left: 0, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="sigla_fazenda"
                      tick={{ fontSize: 11 }} 
                      interval={0}
                      angle={-30}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value) => [value, 'Pesquisadores']}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '2px solid #F39200',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar 
                      dataKey="total" 
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                    >
                      {fazendasData.fazendas.map((entry, index) => (
                        <Cell key={`cell-fazenda-bar-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Tabela/Legenda minimalista e compacta para 21 campos (sem coluna de cor) */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Totalizador Detalhado</h4>
                <div className="max-h-80 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-2 text-left font-semibold">Sigla</th>
                        <th className="py-2 px-2 text-left font-semibold">Campo Experimental</th>
                        <th className="py-2 px-2 text-left font-semibold">Regional</th>
                        <th className="py-2 px-2 text-right font-semibold">Qtd</th>
                        <th className="py-2 px-2 text-right font-semibold">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fazendasData.fazendas
                        .sort((a, b) => b.total - a.total)
                        .map((fazenda) => (
                        <tr key={fazenda.id} className="border-b hover:bg-gray-50">
                          <td className="py-1 px-2 font-semibold text-gray-800">{fazenda.sigla_fazenda}</td>
                          <td className="py-1 px-2 text-gray-700 truncate max-w-[120px]">{fazenda.nome_fazenda}</td>
                          <td className="py-1 px-2 text-gray-400">{fazenda.nome_regional}</td>
                          <td className="py-1 px-2 text-right font-bold text-[#F39200]">{fazenda.total}</td>
                          <td className="py-1 px-2 text-right text-gray-500">
                            {fazendasData.totalGeral > 0 ? ((fazenda.total / fazendasData.totalGeral) * 100).toFixed(1) : '0.0'}%
                          </td>
                        </tr>
                      ))}
                      {/* Total Geral */}
                      <tr className="bg-[#F39200] text-white font-bold">
                        <td className="py-2 px-2">TOTAL</td>
                        <td className="py-2 px-2">Todos os campos</td>
                        <td className="py-2 px-2"></td>
                        <td className="py-2 px-2 text-right">{fazendasData.totalGeral}</td>
                        <td className="py-2 px-2 text-right">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}