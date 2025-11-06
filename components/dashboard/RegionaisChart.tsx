"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface RegionalData {
  id: number;
  nome: string;
  total: number;
}

// Paleta de cores vibrantes em tons de verde/turquesa
const COLORS = [
  "#10B981", // Emerald-500
  "#14B8A6", // Teal-500
  "#06B6D4", // Cyan-500
  "#0EA5E9", // Sky-500
  "#3B82F6", // Blue-500
  "#8B5CF6", // Violet-500
  "#A855F7", // Purple-500
  "#EC4899", // Pink-500
];

export default function RegionaisChart() {
  const [data, setData] = useState<RegionalData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch("/api/dashboard/regionais");
        const result = await response.json();

        if (result.success) {
          setData(result.regionais || []);
        }
      } catch (error) {
        console.error("Erro ao buscar dados das regionais:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="h-80 bg-gray-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 lg:p-8 hover:shadow-xl transition-shadow duration-300 w-full">
      <div className="w-full overflow-hidden">
        <ResponsiveContainer width="100%" height={380}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 10,
            bottom: 70,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="nome"
            angle={-45}
            textAnchor="end"
            height={85}
            interval={0}
            tick={{ fill: "#6B7280", fontSize: 11, fontWeight: 500 }}
          />
          <YAxis
            tick={{ fill: "#6B7280", fontSize: 11 }}
            domain={[0, 'dataMax + 5']}
            label={{
              value: "Pesquisadores",
              angle: -90,
              position: "insideLeft",
              style: { fill: "#6B7280", fontWeight: 600, fontSize: 12 },
            }}
          />
          <Tooltip
            cursor={{ fill: "rgba(2, 92, 62, 0.1)" }}
            contentStyle={{
              backgroundColor: "#fff",
              border: "2px solid #025C3E",
              borderRadius: "12px",
              padding: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            labelStyle={{
              color: "#025C3E",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
            itemStyle={{
              color: "#038451",
              fontWeight: 600,
            }}
            formatter={(value: number) => [`${value} pesquisadores`, "Total"]}
          />
          <Bar
            dataKey="total"
            name="Pesquisadores"
            radius={[8, 8, 0, 0]}
            animationDuration={1000}
            animationBegin={200}
            label={{ 
              position: 'top', 
              fill: '#025C3E', 
              fontSize: 13, 
              fontWeight: 'bold' 
            }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
