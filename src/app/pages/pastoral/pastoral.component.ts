import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Pastoral } from 'src/app/interfaces/pastoral.interface';
import { PastoralService } from 'src/app/services/pastoral.service';

@Component({
  selector: 'app-pastoral',
  templateUrl: './pastoral.component.html',
  styleUrls: ['./pastoral.component.scss'],
})
export class PastoralComponent implements OnInit {

  public pastoral$!: Pastoral;
  public pastorais$!: Observable<Pastoral[]>;
  public pastoral!: Pastoral;
  public isModalOpen = false;
  public defaultImage = '../../../assets/logo_lazy.png';

  constructor(private pastoralService: PastoralService) { }

  ngOnInit() {
    this.filterPastorais();

  }

  getAllPastorais = () => this.pastoralService.getAll();


  filterPastorais() {
    const pastorais = this.getAllPastorais();

    pastorais.subscribe(item => this.pastoral$ = item[0]);
    pastorais.subscribe(item => this.pastorais$ = new Observable(
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

  openModal(pastoral: Pastoral) {
    this.isModalOpen = true;
    this.pastoral = pastoral;
  }

}
