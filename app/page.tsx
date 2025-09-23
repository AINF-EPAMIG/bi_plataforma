import RegionaisDashboard from "../components/dashboard/RegionaisDashboard";
import HomeTabs from "@/components/HomeTabs";

export default function Home() {

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Título Principal */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-800 mb-4">
            Plataforma Interativa
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Dashboard dos pesquisadores por localidade da EPAMIG
          </p>
        </div>

        {/* Abas para desktop */}
        <HomeTabs />
        
        {/* Dashboard de regionais */}
        <RegionaisDashboard />
      </main>
    </div>
  );
}
