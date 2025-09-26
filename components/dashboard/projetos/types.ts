export interface ProgramaData {
  id: number;
  nome: string;
  valores_por_ano: { [ano: string]: number };
  projetos_por_ano: { [ano: string]: number };
  valor_total: number;
  total_projetos: number;
}

export interface ProjetosData {
  success: boolean;
  programas: ProgramaData[];
  anos: number[];
  totais_gerais: {
    valores_por_ano: { [ano: string]: number };
    projetos_por_ano: { [ano: string]: number };
    valor_total_geral: number;
    total_projetos_geral: number;
    valor_ano_vigente: number;
    projetos_ano_vigente: number;
  };
  ano_vigente: number;
  error?: string;
}

export type ViewMode = 'graficos' | 'tabelas';
export type TipoVisualizacao = 'quantitativo' | 'financeiro';

export interface ChartDataItem {
  name: string;
  value: number;
  color: string;
  totalSum: number;
}

export interface InfoBoxItem {
  nome?: string;
  value: number;
  totalSum: number;
}