'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DownloadIcon } from 'lucide-react';
import { ProjetosData, ProgramaData, TipoVisualizacao } from '../types';
import DesktopTable from './DesktopTable';
import MobileTable from './MobileTable';

interface TableCardProps {
  title: string;
  description: string;
  data: ProjetosData;
  programas: ProgramaData[];
  anos: number[];
  anoSelecionado: number;
  tipo: TipoVisualizacao;
  isExporting: boolean;
  onExport: () => void;
}

export default function TableCard({
  title,
  description,
  data,
  programas,
  anos,
  anoSelecionado,
  tipo,
  isExporting,
  onExport
}: TableCardProps) {
  const isFinanceiro = tipo === 'financeiro';
  const buttonColor = isFinanceiro ? 'bg-[#025C3E] hover:bg-[#157A5B]' : 'bg-[#157A5B] hover:bg-[#025C3E]';
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isFinanceiro ? 'bg-[#025C3E]' : 'bg-[#157A5B]'}`}></div>
              {title}
            </CardTitle>
            <CardDescription className="text-sm">
              {description}
            </CardDescription>
          </div>
          <Button 
            onClick={onExport}
            disabled={isExporting}
            className={`${buttonColor} disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Exportando...
              </>
            ) : (
              <>
                <DownloadIcon size={16} />
                Exportar {isFinanceiro ? 'Financeiro' : 'Quantitativo'}
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mobile Table */}
        <MobileTable 
          programas={programas}
          anos={anos}
          anoSelecionado={anoSelecionado}
          tipo={tipo}
        />

        {/* Desktop Table */}
        <DesktopTable 
          data={data}
          programas={programas}
          anos={anos}
          anoSelecionado={anoSelecionado}
          tipo={tipo}
        />
      </CardContent>
    </Card>
  );
}