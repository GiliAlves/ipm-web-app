import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {
  public index: number = 1;

  constructor() { }

  ngOnInit() {
  }

  prevStep = () => this.index--;
  nextStep = () => this.index++;

}
