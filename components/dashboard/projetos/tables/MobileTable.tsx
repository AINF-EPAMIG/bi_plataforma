'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgramaData, TipoVisualizacao } from '../types';
import { COLORS } from '../constants';

interface MobileTableProps {
  programas: ProgramaData[];
  anos: number[];
  anoSelecionado: number;
  tipo: TipoVisualizacao;
}

export default function MobileTable({ 
  programas, 
  anos, 
  anoSelecionado, 
  tipo 
}: MobileTableProps) {
  const isFinanceiro = tipo === 'financeiro';
  const textColor = isFinanceiro ? 'text-[#025C3E]' : 'text-[#157A5B]';
  
  const formatValue = (value: number) => {
    return isFinanceiro 
      ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      : value.toString();
  };

  const getValueForPrograma = (programa: ProgramaData, ano: number) => {
    return isFinanceiro 
      ? programa.valores_por_ano[ano] || 0
      : programa.projetos_por_ano[ano] || 0;
  };

  const getTotalForPrograma = (programa: ProgramaData) => {
    return isFinanceiro ? programa.valor_total : programa.total_projetos;
  };

  const anosParaExibir = anoSelecionado === 0 ? anos : [anoSelecionado];

  return (
    <div className="block lg:hidden space-y-4">
      {programas.map((programa, index) => (
        <Card key={programa.id} className="border-2 border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
              {programa.nome}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 text-sm">
              {anosParaExibir.map(ano => (
                <div key={ano} className="flex justify-between py-1 border-b border-gray-100">
                  <span className="font-medium">{ano}:</span>
                  <span>{formatValue(getValueForPrograma(programa, ano))}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 border-t-2 border-gray-200 font-bold">
                <span>Total Geral:</span>
                <span className={textColor}>
                  {formatValue(getTotalForPrograma(programa))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}