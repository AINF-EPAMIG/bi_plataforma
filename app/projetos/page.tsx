"use client";
import HomeTabs from "@/components/HomeTabs";
import ProjetosDashboard from "../../components/dashboard/ProjetosDashboard";
import Header from "@/components/header";

export default function ProjetosPage() {
  return (
    <div className="flex min-h-screen bg-gray-50 flex-col">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Título Principal */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-800 mb-4">
            Plataforma Interativa
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Dashboard dos projetos dos pesquisadores da EPAMIG
          </p>
        </div>

        {/* Abas para desktop */}
        <HomeTabs />

        {/* Dashboard de projetos */}
        <ProjetosDashboard />
      </main>
    </div>
  );
}