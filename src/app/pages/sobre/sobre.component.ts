import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.component.html',
  styleUrls: ['./sobre.component.scss'],
})
export class SobreComponent implements OnInit {

  public ipm: boolean = true;
  public defaultImage = '../../../assets/logo_lazy.png';
  public histIPB = [
    {
      title: `HISTÓRIA DO PRESBITERIANISMO`,
      description: `As origens históricas mais remotas do presbiterianismo remontam aos primórdios da Reforma Protestante do século XVI. Como é bem sabido, a Reforma teve início com o questionamento do catolicismo medieval feito pelo monge alemão Martinho Lutero (1483-1546) a partir de 1517. Em pouco tempo, os seguidores desse movimento passaram a ser conhecidos como “luteranos” e a igreja que resultou do mesmo foi denominada Igreja Luterana.`
    },
    {
      title: `O QUE É IPB`,
      description: `A Igreja Presbiteriana do Brasil é uma federação de igrejas que têm em comum uma história, uma forma de governo, uma teologia, bem como um padrão de culto e de vida comunitária. Historicamente, a IPB pertence à família das igrejas reformadas ao redor do mundo, tendo surgido no Brasil em 1859, como fruto do trabalho missionário da Igreja Presbiteriana dos Estados Unidos.`
    },
    {
      title: `DENOMINAÇÕES PRESBITERIANAS NO BRASIL`,
      description: `A Igreja Presbiteriana do Brasil é a mais antiga denominação reformada do país, tendo sido fundada pelo missionário Ashbel Green Simonton (1833-1867), que aqui chegou em 1859. Mais tarde, ao longo do século 20, surgiram outras igrejas congêneres que também se consideram herdeiras da tradição calvinista. São as seguintes, por ordem cronológica de organização: Igreja Presbiteriana Independente do Brasil (1903), com sede em São Paulo; Igreja Presbiteriana Conservadora (1940), com sede em São Paulo; Igreja Presbiteriana Fundamentalista (1956), com sede em Recife; Igreja Presbiteriana Renovada do Brasil (1975), com sede em Arapongas, Paraná, e Igreja Presbiteriana Unida do Brasil (1978), com sede no Rio de Janeiro.`
    },
    {
      title: `REV. ASHBEL GREEN SIMONTON`,
      description: `Ashbel Green Simonton (1833-1867), o fundador da Igreja Presbiteriana do Brasil, nasceu em West Hanover, no sul da Pensilvânia, e passou a infância na fazenda da família, denominada Antigua. Eram seus pais o médico e político William Simonton e D. Martha Davis Snodgrass (1791-1862), filha de um pastor presbiteriano. Ashbel era o mais novo de nove irmãos. Os irmãos homens (William, John, James, Thomas e Ashbel) costumavam denominar-se os "quinque fratres" (cinco irmãos). Um deles, James Snodgrass Simonton, quatro anos mais velho que Ashbel, viveu por três anos no Brasil e foi professor na cidade de Vassouras, no Rio de Janeiro. Uma das quatro irmãs, Elizabeth Wiggins Simonton (1822-1879), conhecida como Lille, veio a casar-se com o Rev. Alexander Latimer Blackford, vindo com ele para o Brasil.`
    },
    {
      title: `ESBOÇO HISTÓRICO`,
      description: `Atualmente existem no Brasil várias denominações de origem reformada ou calvinista. Entre elas incluem-se a Igreja Presbiteriana Independente, a Igreja Presbiteriana Conservadora e algumas igrejas criadas por imigrantes vindos da Europa continental, tais como suíços, holandeses e húngaros. No entanto, a maior e mais antiga denominação reformada do país é a Igreja Presbiteriana do Brasil. Ao mesmo tempo, convém lembrar que, já nos primeiros séculos da história do Brasil, houve a presença de calvinistas em nosso país.`
    },
    {
      title: `IMPLANTAÇÃO DA IPB (1859-1869)`,
      description: `O surgimento do presbiterianismo no Brasil resultou do pioneirismo e desprendimento do Rev. Ashbel Green Simonton (1833-1867). Nascido em West Hanover, na Pensilvânia, Simonton estudou no Colégio de Nova Jersey e inicialmente pensou em ser professor ou advogado. Influenciado por um reavivamento em 1855, fez a sua profissão de fé e, pouco depois, ingressou no Seminário de Princeton. Um sermão pregado por seu professor, o famoso teólogo Charles Hodge, levou-o a considerar o trabalho missionário no estrangeiro. Três anos depois, candidatou-se perante a Junta de Missões da Igreja Presbiteriana dos Estados Unidos, citando o Brasil como campo de sua preferência. Dois meses após a sua ordenação, embarcou para o Brasil, chegando ao Rio de Janeiro em 12 de agosto de 1859, aos 26 anos de idade.`
    },
  ];

  public histIPM = [
    {
      title: `HISTÓRIA DE ORGANIZAÇÃO`,
      description: `A ideia de iniciar um trabalho Presbiteriano em Mauá surgiu com Adolpho Borges de Oliveira Filho, Elcias Camilo Costa, Alcides Vieira Dias e Miguel Arcanjo Domingues. Desde que chegara à Mauá o Sr. Adolpho sentiu essa necessidade e entrando em contato com outros presbiterianos reuniu-se com eles em Setembro de 1959 em sua residência, na época situada à Rua Campos Sales, 400.`,
      img: 'https://firebasestorage.googleapis.com/v0/b/ipm-task-app.appspot.com/o/app%2F04.png?alt=media&token=5457eca0-29d2-434d-8707-29d8fc2452b0'
    },
    {
      title: ``,
      description: `Nesta reunião ficou acertado que procurariam estabelecer uma congregação na cidade. O Sr. Alcides entrou em contato com o Rev. Boanerges Ribeiro, pastor da Igreja Presbiteriana do Brás em São Paulo e com o interesse do mesmo bem como Sociedade Missionário Alvaro Reis da referida Igreja tratou-se de organizar a Congregação. A Organização da Congregação Presbiteriana de Mauá se deu em 21 de Fevereiro de 1960 na residência do Sr. Alcides Vieira Dias, uma casa que pertenceu ao Barão de Mauá. O Reverendo Boanerges Ribeiro esteve presente, bem como o Presbítero Dr. Nardy Ferreira, Azarias Silvério da Costa, Josias Navarro e o Diácono Daniel Becker de Sociedade Alvaro Reis. Diversos outros irmãos também estavam presentes. A nova Congregação ficou sob a orientação e Direção da Sociedade Missionária Alvaro Reis. Os atos Pastorais seriam dados pelo Rev. Oscar Chaves da Igreja Presbiteriana de Santo André.`,
      img: 'https://firebasestorage.googleapis.com/v0/b/ipm-task-app.appspot.com/o/app%2F03.png?alt=media&token=ff21a326-bc99-4883-8d8f-f179ed1c6679'
    },
    {
      title: ``,
      description: `Até Julho de 1960 a congregação reuniu-se na residência do Sr. Alcides. Em agosto de 1960 é transferida para um salão alugado à Rua Vitorino, 27. Neste período o responsável nomeado pelo Conselho do Brás era o Presbítero Dolival Delfin. Diversos irmãos da Igreja do Brás cooperaram no trabalho. A Interrupção foi pequena. Logo os fiéis começam a se reunir na residência do Sr. José Salvador Bovetto, sita a Avenida Miranda Coelho, 487 (hoje Av. Presidente Castelo Branco). Contudo, neste local apenas era realizada a Escola Dominical. Ainda em 1964, enquanto a Congregação passava por grandes dificuldades, a Igreja Presbiteriana do Brás adquiriu um terreno á Rua Almirante Tamandaré, onde depois de grande esforço dos crentes foi construído um salão de cultos próprio. Este humilde templo foi inaugurado em 6 de Junho de 1965. Em Junho de 1966, sob o Pastorado do Rev. Domingos Rodrigues Hidalgo, o Conselho da Igreja do Brás transfere a Congregação de Mauá e suas propriedades para a Igreja Presbiteriana de Santo André. E desde então o Rev. Oscar Chaves prestava ao trabalho a assistência pastoral. Em 1970, o salãozinho é ampliado. Em 1973 é adquirido outro terreno ao lado; constrói-se o pavimento térreo do Edifício da Escola Dominical. Entre 1979 e início de 1980, o pavimento superior com quatro salas para a Escola é construído. E experimentado sempre um crescimento não só físico mas numérico e sobretudo espiritual, a Congregação veio a ser Organizada em Igreja. O Presbitério da Borda do Campo decidiu por sua organização na reunião ordinária de 1981, e em 1 de Fevereiro o grande sonho dos presbiterianos de Mauá veio concretizado. De Março a Julho, o Rev. Oscar Chaves, pastor da igreja Presbiteriana de Santo André foi responsável pelos Atos Pastorais. A partir de 28 de Julho de 1981, a igreja passa a ser pastoreada pelo Rev. Marcio da Silva Pinto, que desde 1979 tem cooperado com o trabalho como seminarista e desde de março de 1981 como licenciado. A igreja contava no seu conselho com três Presbíteros: José Salvador Bovetto, Manoel Severo Alves e Davi Jacinto. A junta Diaconal era presidida pelo Diácono Daniel Jacinto e além dele contava com outros dois diáconos: Marco Antonio da Silva e Vicente Divino de Oliveira. O rol de membros possuía 118 arrolados, sendo 79 comungantes e 39 não comungantes. A escola Dominical possuía 185 alunos matriculados. A igreja possuía SAF, UPH, UPA, UCP, UMP e coro.`,
      img: ''
    }
  ]
  constructor() { }

  ngOnInit() {}

  handleHistory($event: any) {
    this.ipm = !this.ipm;
  }

}
