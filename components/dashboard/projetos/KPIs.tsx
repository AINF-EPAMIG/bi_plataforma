'use client';

import { ProjetosData } from './types';

interface KPIsProps {
  data: ProjetosData;
  anoSelecionado: number;
  valorAno: number;
  projetosAno: number;
}

export default function KPIs({ data, anoSelecionado, valorAno, projetosAno }: KPIsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
        <div className="text-sm text-gray-700 mb-1">Projetos (Total)</div>
        <div className="text-2xl md:text-2xl font-extrabold text-blue-700">
          {data.totais_gerais.total_projetos_geral}
        </div>
      </div>
      <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
        <div className="text-sm text-gray-700 mb-1">Projetos (Ano)</div>
        <div className="text-2xl md:text-2xl font-extrabold text-red-700">
          {anoSelecionado === 0 ? data.totais_gerais.projetos_ano_vigente : projetosAno}
        </div>
      </div>
      <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4">
        <div className="text-sm text-gray-700 mb-1">Valor (Total)</div>
        <div className="text-2xl md:text-2xl font-extrabold text-green-700">
          R$ {data.totais_gerais.valor_total_geral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>
      </div>
      <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4">
        <div className="text-sm text-gray-700 mb-1">Valor (Ano)</div>
        <div className="text-2xl md:text-2xl font-extrabold text-green-700">
          R$ {(anoSelecionado === 0 ? data.totais_gerais.valor_ano_vigente : valorAno)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>
      </div>
    </div>
  );
}