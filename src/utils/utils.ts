export const NORMALIZE = (term: string) => {
  const accentMap: any = {
    á: 'a', à: 'a', ã: 'a',
    é: 'e', è: 'e', ê: 'e',
    í: 'i', ì: 'i', ó: 'o',
    ò: 'o', ô: 'o', õ: 'o',
    ú: 'u', ù: 'u', ü: 'u',
    ç: 'c'
  };
  let ret = '';
  for (let i = 0; i < term.length; i++) {
    ret += accentMap[term.charAt(i)] || term.charAt(i);
  }
  return ret;
};

export const NOT_NUMBER = (term: any) => term.replace(/[0-9]/,'');

export const NORMALIZE_HTML = (term: string) => term
  .replace(/(<br>)/g, "\n")
  .replace(/(<p>)/g, "\n")
  .replace(/<\/?[^>]+(>|$)/g, "")
  .replace(/^\n/, "");

export const DECODE_HTML_CHAR_CODES = (str: string) =>
  str.replace(/(&#(\d+);)/g, (match, capture, charCode) => String.fromCharCode(charCode));

export const SIZE_ARRAY = (arr: any, length: number) => arr.length === length;

export const REMOVE_FIRST_FROM_ARRAY = (arr: any) => arr.pop();

export const UNIQUE_ARRAY = (arr: any) =>
  arr.filter((a: any, i: any) => arr.indexOf(a) === i);

export const FIND_IN_ARRAY = (arr: any, item: any, key: string) =>
  arr.find((a: any) => (a[key] === item[key]));

export const FILTER_IN_ARRAY = (arr: any, key: string, term: string) =>
  arr.filter(( result: any ) => result[key].toLowerCase().indexOf(term) > -1);

export const REMOVE_ITEM_ARRAY = (arr: any, item: any, key: string) =>
  arr.filter((a: any) => a[key] !== item[key]);

  export const BTN_ACTION = [
    {
      icon: "musical-notes-outline",
      text: "Partitura",
      handler: () => {},
    },
    // {
    //   icon: "headset-outline",
    //   text: "Vozes",
    //   handler: () => {},
    // },
    {
      icon: "copy-outline",
      text: "Copiar Hino",
      handler: () => {},
    },
    {
      icon: "share-social",
      text: "Compartilhar",
      handler: () => {},
    },
    {
      text: 'Cancelar',
      role: 'cancel',
    }
  ];

  export const COLORS = [
    '#000000',
    '#363636',
    '#696969',
    '#A9A9A9',
    '#DCDCDC',
    '#f4f5f8',

    '#191970',
    '#0000CD',
    '#4169E1',
    '#87CEEB',
    '#87CEFA',
    '#ADD8E6',

    '#005B40',
    '#1a6b53',
    '#6B8E23',
    '#28ba62',
    '#00FF00',
    '#ADFF2F',

    '#8B4513',
    '#D2691E',
    '#CD853F',
    '#DAA520',
    '#F4A460',
    '#DEB887',

    '#4B0082',
    '#A020F0',
    '#8B008B',
    '#FF1493',
    '#F08080',
    '#FFC0CB',

    '#8B0000',
    '#B22222',
    '#cf3c4f',
    '#FF0000',
    '#eb445a',
    '#FA8072',
  ];

  export const COLORS_DARK = [
    '#000000',
    '#363636',
    '#696969',
    '#191970',
    '#0000CD',
    '#4169E1',
    '#005B40',
    '#1a6b53',
    '#6B8E23',
    '#8B4513',
    '#D2691E',
    '#CD853F',
    '#4B0082',
    '#A020F0',
    '#8B008B',
    '#8B0000',
    '#B22222',
    '#cf3c4f',
  ];

  export const COLOR_LIGHT = [
    '#A9A9A9',
    '#DCDCDC',
    '#f4f5f8',
    '#87CEEB',
    '#87CEFA',
    '#ADD8E6',
    '#28ba62',
    '#00FF00',
    '#ADFF2F',
    '#DAA520',
    '#F4A460',
    '#DEB887',
    '#FF1493',
    '#F08080',
    '#FFC0CB',
    '#FF0000',
    '#eb445a',
    '#FA8072',
  ];

  export const STORAGE = {
    searchFilter: [],
    recents: [],
    favorites: [],
    formatacao: {
      fonte: "'Helvetica Neue', sans-serif",
      style: false,
      weight: false,
      corFonte: '#005B40',
      tamanhoFonte: 12,
      backgrond: false,
    },
  };

  export const FONTS = [
    { title: 'Abel', value: "'Abel', sans-serif" },
    { title: 'Combo', value: "'Combo', cursive" },
    { title: 'Comic Neue', value: "'Comic Neue', cursive" },
    { title: 'Crimson Text', value: "'Crimson Text', serif" },
    { title: 'Dancing Script', value: "'Dancing Script', cursive" },
    { title: 'Helvetica', value: "'Helvetica Neue', sans-serif" },
    { title: 'Italiana', value: "'Italiana', serif" },
    { title: 'Julee', value: "'Julee', cursive" },
    { title: 'Lato', value: "'Lato', sans-serif" },
    { title: 'Montserrat', value: "'Montserrat', sans-serif" },
    { title: 'Open Sans', value: "'Open Sans', sans-serif" },
    { title: 'Shadows', value: "'Shadows Into Light', cursive" },
    { title: 'Sofia', value: "'Sofia Sans Semi Condensed', sans-serif" },
  ];

  export const FILTERS = [
    {
      name: 'Jesus',
      active: false
    },
    {
      name: 'Deus',
      active: false
    },
    {
      name: 'Amor',
      active: false
    },
    {
      name: 'Alegria',
      active: false
    }
  ];

export const MSG_STORAGE_ERROR = 'Erro ao obter dados armazenados: ';
