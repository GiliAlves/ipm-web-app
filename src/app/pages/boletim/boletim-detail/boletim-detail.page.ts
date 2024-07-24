import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { log } from 'console';
import { Boletim } from 'src/app/interfaces/boletim.interface';

@Component({
  selector: 'app-boletim-detail',
  templateUrl: './boletim-detail.page.html',
  styleUrls: ['./boletim-detail.page.scss'],
})
export class BoletimDetailPage implements OnInit {
  public boletim!: Boletim;
  public isOrder: boolean = false;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() { 
      this.activatedRoute.data.subscribe((data: Data) => this.boletim = data['boletim']);
      console.log(this.boletim);
      
  }

  innerHTMLClick(event: Event) {
    const element = event.target as HTMLElement;
    const text = element.childNodes[1].textContent?.trim().split(' ');
    if (text && text.length) {
      const livro = text[0];
      const capitulo = text[1].split('.')[0]
      const versiculoInicial = text[1].split('.')[1].split('-')[0];
      const versiculoFim = text[1].split('-')[1];

      console.log(livro, capitulo, versiculoInicial, versiculoFim);
    }
  }

  public getOrder = () => this.isOrder = !this.isOrder;

  public formatDescricao = (descricao: string) => descricao.replaceAll('' , '<br>');
}
