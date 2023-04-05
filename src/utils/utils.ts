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

