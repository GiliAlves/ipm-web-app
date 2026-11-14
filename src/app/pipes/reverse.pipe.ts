import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse',
  standalone: true,
})
/**
 * Pipe que inverte a ordem dos itens de um array.
 */
export class ReversePipe implements PipeTransform {

  /**
   * Retorna uma nova instância do array invertido.
   * @param value - Array a ser invertido.
   * @returns Array invertido.
   */
  transform = (value: unknown[]) => value.slice().reverse();

}
