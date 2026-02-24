// Database models for AgroGestão Simples

export interface Propriedade {
  id: string;
  nomePropriedade: string;
  nomeProdutor: string;
  criadoEm: string;
}

export interface Cultura {
  id: string;
  nome: string;
  unidadePadrao: "kg" | "saco" | "unidade" | "caixa";
}

export interface Safra {
  id: string;
  culturaId: string;
  dataInicio: string;
  dataFim?: string;
  observacoes?: string;
}

export type CategoriaDespesa =
  | "sementes"
  | "adubo"
  | "defensivo"
  | "combustivel"
  | "mao_de_obra"
  | "manutencao"
  | "outros";

export interface Despesa {
  id: string;
  data: string;
  categoria: CategoriaDespesa;
  descricao: string;
  valor: number;
  culturaId?: string;
  safraId?: string;
}

export type CanalVenda = "feira" | "atravessador" | "cooperativa" | "outros";

export interface Venda {
  id: string;
  data: string;
  culturaId: string;
  quantidade: number;
  unidade: string;
  valorTotal: number;
  canal: CanalVenda;
}
