import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Observable } from 'rxjs';
import { NovoCantico } from 'src/app/interfaces/novo-cantico.interface';
import { NovoCanticoService } from 'src/app/services/novo-cantico.service';

@Component({
  selector: 'app-novo-cantico',
  templateUrl: './novo-cantico.component.html',
  styleUrls: ['./novo-cantico.component.scss'],
})
export class NovoCanticoComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  hinos$!: Observable<NovoCantico[]>;
  hino!: NovoCantico;
  isModalOpen = false;

  constructor(private canticoService: NovoCanticoService) { }

  ngOnInit() {
    this.hinos$ = this.getCanticos();
  }

  getCanticos = () => this.canticoService.getAll();

  handleChange(event: any) {
    if (event && event.detail.value) {
      const query = event.target.value.toLowerCase();
      this.hinos$.subscribe(
        hino => this.hinos$ = new Observable(
          (observer) => {
            let value: NovoCantico[] = [];

            if (Number(query)) {
              value = value.concat(hino.filter(({ numero }) => numero.toLowerCase() == query));
            } else {
              value = value.concat(hino.filter(({ letra }) => letra.toLowerCase().indexOf(query) > -1));
              value = value.concat(hino.filter(({ titulo }) => titulo.toLowerCase().indexOf(query) > -1));
            }

            observer.next(value.filter((a, i) => value.indexOf(a) === i))
            observer.complete();
            () => observer.unsubscribe();
          }
        )
      );
    } else {
      this.hinos$ = this.getCanticos();
    }
  }

  handleCancel = () => this.hinos$ = this.getCanticos();

  handleRefresh(event: any) {
    setTimeout(() => {
      window.location.reload();
      event.target.complete();
    }, 2000);
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openModal(cantico: NovoCantico) {
    this.isModalOpen = true;
    this.hino = cantico;
  }
}
