export interface Membro {
  uid?: string;
  nome: string;
  dataNascimento: string;
  sexo?: string;
  celular?: string;
  email?: string;
  pai?: string;
  mae?: string;

  estado_civil?: string;
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

  sociedade_interna?: string;
  cargo?: string;
  status?: string;
  residente?: string;
  observacoes?: string;
}
