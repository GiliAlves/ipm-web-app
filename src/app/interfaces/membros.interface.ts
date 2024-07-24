export interface Membros {
    id: string;

    foto?: string;
    nome: string;
    dtNasc: any;
    genero?: 'masculino'| 'feminino';
    estadoCivil?: 'solteiro' | 'casado' | 'viuvo' | 'divorciado';
    conjuge?: string;
    conjugeId?: string;
    dataCasamento?: any;
    
    cep?: string;
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    complemento?: string;

    email?: string;
    telefone?: string;
    celular?: string;
    
    membro: Membro;
    observacao?: string;
}

export interface Membro {
    status: 'comungante' | 'não comungante' | 'rol separado' | 'visitante' | 'excluído';
    lideranca?: 'presbítero' | 'diácono' | 'pastor' | 'nda';
    dataEntrada?: Date;
    residente:  'sede' | 'zaira';
    sociedade: Sociedade[];
    salaEbd: Ebd;
    cargo: Cargo[];
    responsavel: string;
    frequenciaCulto?: Frequencia[];
    acompanhamentos: Acompanhamento[];
}

export interface Acompanhamento {
    id?: string;
    data: string;
    ano: string;
    mes: string;
    dia: string;
    horario: string;
    title?: string;
    description?: string;
    avaliacao: number;
    inicio?: boolean;
    fim?: boolean;
}

export interface Frequencia {
    id?: string;
    data: string;
    ano: string;
    mes: string;
    dia: string;
    horario: string;
    status: 'presente'| 'ausente';
}

export interface Sociedade {
    nome: 'UPH' | 'SAF' | 'UMP' | 'UPA' | 'UCP' | 'nda';
    status: 'ativo' | 'cooperador' | 'emérito' | 'conselheiro(a)' | 'orientador(a)' | 'nda' |
        'presidente' | 'vice-presidente' | '1°secretário(a)' | '2°secretário(a)' | 'tesoureiro'
}

export interface Cargo {
    nome: string;
    status: boolean;
    data: Date;
    vigencia: number;
}

export interface Ebd {
    nome: 'noé' | 'raios de luz' | 'davi' | 'ezequiel' | 'moíses' | 'judá' | 'nda';
    status: 'aluno' | 'professor' | 'visitante' | 'nda';
    frequencia: Frequencia[];
}