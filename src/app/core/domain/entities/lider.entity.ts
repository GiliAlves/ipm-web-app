/**
 * Entidade de domínio que representa um membro em cargo de liderança.
 */
export interface Lider {
  uid?: string;
  nome: string;
  dataNascimento: string;
  sexo?: string;
  celular?: string;
  email?: string;
  pai?: string;
  mae?: string;
  estadoCivil?: string;
  conjuge?: string;
  dataCasamento?: string;
  cep?: string;
  logradouro?: string;
  estado?: string;
  bairro?: string;
  cidade?: string;
  numero?: number;
  complemento?: string;
  telefone?: string;
  sociedadeInterna?: string;
  cargo?: string;
  status?: string;
  residente?: string;
  observacoes?: string;
}
