'use client';

import Sidebar from '../../components/sidebar-responsive';
import ProjetosDashboard from '../../components/dashboard/ProjetosDashboard';

export default function ProjetosPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 lg:ml-[250px] p-4 sm:p-6 lg:p-8">
        {/* Header do dashboard - Responsivo */}
        <div className="mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-center text-[#157A5B] tracking-tight rounded-lg py-3 px-4 sm:py-4 sm:px-6 w-full max-w-4xl mx-auto ">
            Projetos Executados
          </h2>
        </div>

        {/* Dashboard de projetos */}
        <ProjetosDashboard />
      </main>
    </div>
  );
}