"use client"

import { useEffect, useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LabelList, PieChart, Pie, Legend, CartesianGrid
} from "recharts"

import { BarChart as BarChartIcon, PieChart as PieChartIcon, Table as TableIcon, Loader2 } from "lucide-react"

import {
  Card, CardContent, CardHeader,
} from "@/components/ui/card"

import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs"

export function DashboardCharts() {
  const [dados, setDados] = useState<unknown[]>([])
  const [currentTab, setCurrentTab] = useState("bar")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const res = await fetch("/api/portaria")
        if (!res.ok) throw new Error('Failed to fetch data')
        const data = await res.json()
        setDados(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const tabs = ["bar", "pie", "data"]
    const interval = setInterval(() => {
      setCurrentTab(prev => {
        const nextIndex = (tabs.indexOf(prev) + 1) % tabs.length
        return tabs[nextIndex]
      })
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  const counts = (dados as Array<{ tipo_id?: number }>).reduce((acc, curr) => {
    const tipo = curr.tipo_id?.toString()
    if (tipo) acc[tipo] = (acc[tipo] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const typeData = [
    { name: "Portarias", value: counts["1"] || 0 },
    { name: "Deliberações", value: counts["4"] || 0 },
    { name: "Resoluções", value: counts["5"] || 0 },
    { name: "BIA", value: counts["3"] || 0 },
  ]

  const COLORS = ["#3A8144", "#357EDD", "#555555", "#EA580C"]
  const totalAtos = typeData.reduce((sum, d) => sum + d.value, 0)
  const dataAtual = new Date().toLocaleDateString("pt-BR")

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white border rounded-lg shadow-lg">
          <p className="font-semibold text-[#3A8144]">{label}</p>
          <p className="text-sm">
            Quantidade: <span className="font-medium">{payload[0].value}</span>
          </p>
          <p className="text-xs text-gray-500">
            {((payload[0].value / totalAtos) * 100).toFixed(1)}% do total
          </p>
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <Card className="w-full h-[400px] border border-[#3A8144] rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-[#3A8144]" />
          <p className="text-sm text-gray-600">Carregando dados...</p>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full h-[400px] border border-red-500 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium">Erro ao carregar dados</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full h-auto min-h-[400px] border border-[#3A8144] rounded-lg">
      <CardHeader>
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-semibold text-[#3A8144]">Distribuição dos Atos por Tipo</span>
            <span className="bg-[#3A8144] text-white text-xs font-medium px-3 py-1 rounded-full">
              Total: {totalAtos.toLocaleString('pt-BR')}
            </span>
          </div>
          <span className="text-xs text-gray-500">Atualizado em {dataAtual}</span>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
          <TabsList className="w-full grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-lg shadow-sm">
            <TabsTrigger
              value="bar"
              className="data-[state=active]:bg-[#3A8144] data-[state=active]:text-white hover:bg-[#3A8144]/90 transition-all rounded-md text-sm font-medium py-2 flex items-center justify-center gap-2"
            >
              <BarChartIcon size={16} className="shrink-0" />
              <span className="hidden sm:inline">Gráfico</span>
            </TabsTrigger>
            <TabsTrigger
              value="pie"
              className="data-[state=active]:bg-[#3A8144] data-[state=active]:text-white hover:bg-[#3A8144]/90 transition-all rounded-md text-sm font-medium py-2 flex items-center justify-center gap-2"
            >
              <PieChartIcon size={16} className="shrink-0" />
              <span className="hidden sm:inline">Pizza</span>
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="data-[state=active]:bg-[#3A8144] data-[state=active]:text-white hover:bg-[#3A8144]/90 transition-all rounded-md text-sm font-medium py-2 flex items-center justify-center gap-2"
            >
              <TableIcon size={16} className="shrink-0" />
              <span className="hidden sm:inline">Dados</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bar">
            <div className="w-full h-[300px] sm:h-[320px] md:h-[360px] lg:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" barSize={40} radius={[6, 6, 0, 0]} animationDuration={800} isAnimationActive minPointSize={5}>
                    <LabelList dataKey="value" position="top" fill="#333" fontSize={12} />
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="pie">
            <div className="relative w-full px-4 h-[460px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="60%"
                    innerRadius="40%"
                    paddingAngle={2}
                    isAnimationActive={true}
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '13px', marginTop: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-sm sm:text-base font-semibold text-[#3A8144]">
                  Total de Atos<br />
                  <span className="text-xl font-bold">{totalAtos.toLocaleString("pt-BR")}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="data">
            <div className="space-y-2 text-sm sm:text-base">
              {typeData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{item.value}</span>
                    <span className="text-gray-500 text-sm">
                      ({((item.value / totalAtos) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-4 mt-2 border-t">
                <p className="text-right text-sm text-gray-600">
                  Total de Atos: <strong className="text-[#3A8144] font-semibold">{totalAtos}</strong>
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}