'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, CalendarIcon, FilterIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ProjetosData } from '../types';

interface DashboardFiltersProps {
  regionalSelecionado: string;
  anoSelecionado: number;
  programasSelecionados: number[];
  isProgramModalOpen: boolean;
  data: ProjetosData | null;
  anos: number[];
  onRegionalChange: (regional: string) => void;
  onYearSelect: (ano: number | 'todos') => void;
  onProgramSelect: (programaId: number) => void;
  onSelectAllPrograms: () => void;
  onProgramModalToggle: (open: boolean) => void;
}

export default function DashboardFilters({
  regionalSelecionado,
  anoSelecionado,
  programasSelecionados,
  isProgramModalOpen,
  data,
  anos,
  onRegionalChange,
  onYearSelect,
  onProgramSelect,
  onSelectAllPrograms,
  onProgramModalToggle
}: DashboardFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      {/* Regional Filter */}
      <div className="flex items-center gap-2">
        <MapPin className="text-gray-600" size={18} />
        <span className="text-sm text-gray-700">Regional:</span>
        <Select value={regionalSelecionado} onValueChange={onRegionalChange}>
          <SelectTrigger className="h-9 w-[160px] border-2 border-emerald-700 text-emerald-800 focus:ring-emerald-700 focus-visible:ring-emerald-700">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SEDE">SEDE</SelectItem>
            <SelectItem value="CENTRO OESTE">CENTRO OESTE</SelectItem>
            <SelectItem value="NORTE">NORTE</SelectItem>
            <SelectItem value="ITAP">ITAP</SelectItem>
            <SelectItem value="ILCT">ILCT</SelectItem>
            <SelectItem value="SUL">SUL</SelectItem>
            <SelectItem value="SUDESTE">SUDESTE</SelectItem>
            <SelectItem value="OESTE">OESTE</SelectItem>
            <SelectItem value="GERAL">GERAL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Year Filter */}
      <div className="flex items-center gap-2">
        <CalendarIcon className="text-gray-600" size={18} />
        <span className="text-sm text-gray-700">Ano:</span>
        <Select 
          value={anoSelecionado === 0 ? 'todos' : String(anoSelecionado)} 
          onValueChange={(val) => onYearSelect(val === 'todos' ? 'todos' : Number(val))}
        >
          <SelectTrigger className="h-9 w-[120px] border-2 border-emerald-700 text-emerald-800 focus:ring-emerald-700 focus-visible:ring-emerald-700">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {anos.map((ano) => (
              <SelectItem key={ano} value={String(ano)}>{ano}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Program Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">Programas:</span>
        <Popover open={isProgramModalOpen} onOpenChange={onProgramModalToggle}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="h-9 flex items-center gap-2 border-2 border-emerald-700 text-emerald-800 focus:ring-emerald-700 focus-visible:ring-emerald-700" 
              aria-label="Selecionar programas"
            >
              <FilterIcon size={18} /> ({programasSelecionados.length}/{data?.programas.length || 0})
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-96 p-0 max-h-[70vh] overflow-y-auto">
            <div className="p-4 pb-2 border-b">
              <p className="text-sm font-semibold">Selecionar Programas</p>
              <p className="text-xs text-gray-500">Escolha os programas para visualizar nos gráficos e relatórios</p>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={onSelectAllPrograms}
                  className="text-sm"
                >
                  {data && programasSelecionados.length === data.programas.length ? 'Deselecionar Todos' : 'Selecionar Todos'}
                </Button>
                <span className="text-sm text-gray-500">
                  {programasSelecionados.length} de {data?.programas.length || 0} selecionados
                </span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {data?.programas.map((programa) => (
                  <div key={programa.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50">
                    <input
                      type="checkbox"
                      id={`programa-${programa.id}`}
                      checked={programasSelecionados.includes(programa.id)}
                      onChange={() => onProgramSelect(programa.id)}
                      className="h-4 w-4 text-[#025C3E] focus:ring-[#025C3E] border-gray-300 rounded"
                    />
                    <label 
                      htmlFor={`programa-${programa.id}`}
                      className="flex-1 text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      {programa.nome}
                    </label>
                    <span className="text-xs text-gray-500">
                      {programa.total_projetos} projetos
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={() => onProgramModalToggle(false)}
                  className="bg-[#025C3E] hover:bg-[#157A5B]"
                >
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}