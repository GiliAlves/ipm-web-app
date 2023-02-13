import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Devocional } from 'src/app/interfaces/devocional.interface';
import { DevocionalService } from 'src/app/services/devocional.service';

@Component({
  selector: 'app-devocional',
  templateUrl: './devocional.component.html',
  styleUrls: ['./devocional.component.scss'],
})
export class DevocionalComponent implements OnInit {

  devocional$!: Devocional;
  devocionais$!: Observable<Devocional[]>;
  devocional!: Devocional;
  isModalOpen = false;

  constructor(private devocionalService: DevocionalService) { }

  ngOnInit() {
    this.filterDevocionais();

  }

  getAllDevocionais = () => this.devocionalService.getAll();


  filterDevocionais() {
    const pastorais = this.getAllDevocionais();

    pastorais.subscribe(item => this.devocional$ = item[0]);
    pastorais.subscribe(item => this.devocionais$ = new Observable(
      obs => {
        item.shift();
        obs.next(item);
        obs.unsubscribe();
      })
    );
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openModal(pastoral: Devocional) {
    this.isModalOpen = true;
    this.devocional = pastoral;
  }
}
