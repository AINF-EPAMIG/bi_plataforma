import Sidebar from "../components/sidebar-responsive";
import RegionaisDashboard from "../components/dashboard/RegionaisDashboard";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 lg:ml-[250px] p-4 sm:p-6 lg:p-8">
        {/* Header do dashboard - Responsivo */}
        <div className="mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-center text-[#157A5B] tracking-tight  rounded-lg py-3 px-4 sm:py-4 sm:px-6 w-full max-w-4xl mx-auto">
            Pesquisadores e Assessores Técnicos
          </h2>
        </div>
        
        {/* Dashboard de regionais */}
        <RegionaisDashboard />
      </main>
    </div>
  );
}
