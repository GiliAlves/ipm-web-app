import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizedHtml',
  standalone: true,
})
/**
 * Pipe que marca um trecho de HTML como confiável para renderização,
 * contornando a sanitização padrão do Angular.
 *
 * ⚠️ Use apenas com conteúdo controlado para evitar XSS.
 */
export class SanitizedHtmlPipe implements PipeTransform {

  constructor(private sanitized: DomSanitizer) { }

  /**
   * Transforma uma string HTML em SafeHtml.
   * @param value - String HTML a ser renderizada.
   * @returns Valor marcado como seguro para bind em propriedades innerHTML.
   */
  transform(value: string) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }

}
