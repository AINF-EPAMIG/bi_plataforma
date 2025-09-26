'use client';

import { ProjetosData, ProgramaData, TipoVisualizacao } from '../types';
import { COLORS } from '../constants';

interface DesktopTableProps {
  data: ProjetosData;
  programas: ProgramaData[];
  anos: number[];
  anoSelecionado: number;
  tipo: TipoVisualizacao;
}

export default function DesktopTable({ 
  data, 
  programas, 
  anos, 
  anoSelecionado, 
  tipo 
}: DesktopTableProps) {
  const isFinanceiro = tipo === 'financeiro';
  const headerColor = isFinanceiro ? 'bg-[#025C3E]' : 'bg-[#157A5B]';
  const textColor = isFinanceiro ? 'text-[#025C3E]' : 'text-[#157A5B]';
  
  const formatValue = (value: number) => {
    return isFinanceiro 
      ? value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
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

  const getTotalForAno = (ano: number) => {
    return isFinanceiro 
      ? data.totais_gerais.valores_por_ano[ano] || 0
      : data.totais_gerais.projetos_por_ano[ano] || 0;
  };

  const getTotalGeral = () => {
    return isFinanceiro 
      ? data.totais_gerais.valor_total_geral
      : data.totais_gerais.total_projetos_geral;
  };

  const anosParaExibir = anoSelecionado === 0 ? anos : [anoSelecionado];

  return (
    <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10">
          <tr className={`${headerColor} text-white`}>
            <th className="border border-gray-200 p-3 px-4 text-left font-semibold">Programa</th>
            {anosParaExibir.map(ano => (
              <th key={ano} className="border border-gray-200 p-3 px-4 text-right font-semibold min-w-[140px] whitespace-nowrap">
                {ano}<br />
                <span className="text-xs font-normal">
                  ({isFinanceiro ? 'Valor R$' : 'Qtd'})
                </span>
              </th>
            ))}
            <th className="border border-gray-200 p-3 px-4 text-right font-semibold min-w-[150px] whitespace-nowrap">
              Total<br />
              <span className="text-xs font-normal">
                ({isFinanceiro ? 'Aprovado R$' : 'Projetos'})
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {programas.map((programa, index) => (
            <tr key={programa.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100/60 transition-colors`}>
              <td className="border border-gray-200 p-3 px-4 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  {programa.nome}
                </div>
              </td>
              {anosParaExibir.map(ano => (
                <td key={ano} className="border border-gray-200 p-3 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                  {formatValue(getValueForPrograma(programa, ano))}
                </td>
              ))}
              <td className={`border border-gray-200 p-3 px-4 text-right font-bold ${textColor}`}>
                {formatValue(getTotalForPrograma(programa))}
              </td>
            </tr>
          ))}
          
          {/* Linha de Totais */}
          <tr className={`${headerColor} text-white font-bold`}>
            <td className="border border-gray-200 p-3 px-4">TOTAL GERAL</td>
            {anosParaExibir.map(ano => (
              <td key={ano} className="border border-gray-200 p-3 px-4 text-right whitespace-nowrap">
                {formatValue(getTotalForAno(ano))}
              </td>
            ))}
            <td className="border border-gray-200 p-3 px-4 text-right whitespace-nowrap">
              {formatValue(getTotalGeral())}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}