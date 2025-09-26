'use client';

import { Card, CardContent } from '@/components/ui/card';

// Import components
import { LoadingState, ErrorState, EmptyState } from './projetos/States';
import DashboardFilters from './projetos/filters/DashboardFilters';
import KPIs from './projetos/KPIs';
import ViewModeSwitch from './projetos/ViewModeSwitch';
import ChartCard from './projetos/charts/ChartCard';
import TableCard from './projetos/tables/TableCard';
import { useDashboard } from './projetos/useDashboard';

export default function ProjetosDashboard() {
  const {
    // States
    data,
    loading,
    error,
    anoSelecionado,
    programasSelecionados,
    regionalSelecionado,
    isProgramModalOpen,
    viewMode,
    exportandoFinanceiro,
    exportandoQuantitativo,
    
    // Chart states
    activeQuantitativoIndex,
    activeFinanceiroIndex,
    hoveredQuantitativoIndex,
    hoveredFinanceiroIndex,
    showQuantitativoInfo,
    showFinanceiroInfo,
    animatingQuantitativo,
    animatingFinanceiro,
    
    // Computed values
    anos,
    
    // Functions
    getDadosFiltrados,
    getDadosAnoSelecionado,
    prepararDadosPizza,
    exportarDados,
    
    // Handlers
    handleYearSelect,
    handleProgramSelect,
    handleSelectAllPrograms,
    handleQuantitativoClick,
    handleQuantitativoMouseEnter,
    handleQuantitativoMouseLeave,
    handleFinanceiroClick,
    handleFinanceiroMouseEnter,
    handleFinanceiroMouseLeave,
    
    // Setters
    setRegionalSelecionado,
    setIsProgramModalOpen,
    setViewMode,
    setShowQuantitativoInfo,
    setShowFinanceiroInfo,
  } = useDashboard();

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} />;
  }

  // Empty state
  if (!data || !data.programas.length) {
    return <EmptyState />;
  }

  const { programas } = getDadosFiltrados();
  const { valorAno, projetosAno } = getDadosAnoSelecionado();

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Box única com filtros e KPIs */}
      <Card className="shadow-md border border-gray-100">
        <CardContent className="pt-6">
          {/* Filtros */}
          <DashboardFilters
            regionalSelecionado={regionalSelecionado}
            anoSelecionado={anoSelecionado}
            programasSelecionados={programasSelecionados}
            isProgramModalOpen={isProgramModalOpen}
            data={data}
            anos={anos}
            onRegionalChange={setRegionalSelecionado}
            onYearSelect={handleYearSelect}
            onProgramSelect={handleProgramSelect}
            onSelectAllPrograms={handleSelectAllPrograms}
            onProgramModalToggle={setIsProgramModalOpen}
          />

          {/* KPIs */}
          <KPIs
            data={data}
            anoSelecionado={anoSelecionado}
            valorAno={valorAno}
            projetosAno={projetosAno}
          />
        </CardContent>
      </Card>

      {/* Switch de Visualização */}
      <ViewModeSwitch
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Renderização Condicional - Gráficos ou Tabelas */}
      {viewMode === 'graficos' ? (
        /* Gráficos */
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          {/* Gráfico de Projetos por Programa */}
          <ChartCard
            title="Projetos por Programa"
            anoSelecionado={anoSelecionado}
            data={prepararDadosPizza('quantitativo')}
            activeIndex={activeQuantitativoIndex}
            hoveredIndex={hoveredQuantitativoIndex}
            animatingIndex={animatingQuantitativo}
            showInfo={showQuantitativoInfo}
            tipo="quantitativo"
            onSliceClick={handleQuantitativoClick}
            onMouseEnter={handleQuantitativoMouseEnter}
            onMouseLeave={handleQuantitativoMouseLeave}
            onInfoClose={() => setShowQuantitativoInfo(null)}
          />

          {/* Gráfico de Dados Financeiros */}
          <ChartCard
            title="Dados Financeiros"
            anoSelecionado={anoSelecionado}
            data={prepararDadosPizza('financeiro')}
            activeIndex={activeFinanceiroIndex}
            hoveredIndex={hoveredFinanceiroIndex}
            animatingIndex={animatingFinanceiro}
            showInfo={showFinanceiroInfo}
            tipo="financeiro"
            onSliceClick={handleFinanceiroClick}
            onMouseEnter={handleFinanceiroMouseEnter}
            onMouseLeave={handleFinanceiroMouseLeave}
            onInfoClose={() => setShowFinanceiroInfo(null)}
          />
        </div>
      ) : (
        /* Tabelas */
        <>
          {/* Relatório Detalhado Financeiro */}
          <TableCard
            title="Relatório Detalhado por Programa - Financeiro"
            description="Dados financeiros completos por programa e ano"
            data={data}
            programas={programas}
            anos={anos}
            anoSelecionado={anoSelecionado}
            tipo="financeiro"
            isExporting={exportandoFinanceiro}
            onExport={() => exportarDados('financeiro')}
          />

          {/* Relatório Detalhado Quantitativo */}
          <TableCard
            title="Relatório Detalhado por Programa - Quantitativo"
            description="Dados quantitativos completos por programa e ano"
            data={data}
            programas={programas}
            anos={anos}
            anoSelecionado={anoSelecionado}
            tipo="quantitativo"
            isExporting={exportandoQuantitativo}
            onExport={() => exportarDados('quantitativo')}
          />
        </>
      )}
    </div>
  );
}