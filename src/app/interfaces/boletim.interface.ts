import { Timestamp } from "@angular/fire/firestore";

interface Boletim {
    id: string;
    data: Timestamp;
    mes: string;
    ano: string;
    numeroEdicao: string;
	anoEdicao: string;
    pastoral: Pastoral;
    liturgia: Liturgia;
}

interface Pastoral {
    imgPastoral: string;
    titulo: string;
    autor: string;
    destaque: string;
    descricao: string;
}

interface Liturgia {
    titulo: string;
    subtitulo: string;
    descricao: string;
}

export { Liturgia, Pastoral, Boletim }
