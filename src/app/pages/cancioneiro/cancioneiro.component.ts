import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Cantico } from 'src/app/interfaces/cantico.interface';
import { CancioneiroService } from 'src/app/services/cancioneiro.service';

@Component({
  selector: 'app-cancioneiro',
  templateUrl: './cancioneiro.component.html',
  styleUrls: ['./cancioneiro.component.scss'],
})
export class CancioneiroComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  canticos$!: Observable<Cantico[]>;
  cantico!: Cantico;
  isModalOpen = false;

  constructor(private canticoService: CancioneiroService) { }

  ngOnInit() {
    this.canticos$ = this.getAllCanticos();
  }

  getAllCanticos = () => this.canticoService.getAll();

  handleChange(event: any) {
    if (event && event.detail.value) {
      const query = event.target.value.toLowerCase();
      this.canticos$.subscribe(
        cantico => this.canticos$ = new Observable(
          (observer) => {
            let value: Cantico[] = [];

            if (Number(query)) {
              value = value.concat(cantico.filter(({ numero }) => numero.toLowerCase() == query));
            } else {
              value = value.concat(cantico.filter(({ letra }) => letra.toLowerCase().indexOf(query) > -1));
              value = value.concat(cantico.filter(({ titulo }) => titulo.toLowerCase().indexOf(query) > -1));
            }

            observer.next(value.filter((a, i) => value.indexOf(a) === i))
            observer.complete();
            () => observer.unsubscribe();
          }
        )
      );
    } else {
      this.canticos$ = this.getAllCanticos();
    }
  }

  handleCancel = () => this.canticos$ = this.getAllCanticos();

  handleRefresh(event: any) {
    setTimeout(() => {
      window.location.reload();
      event.target.complete();
    }, 2000);
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openModal(cantico: Cantico) {
    this.isModalOpen = true;
    this.cantico = cantico;
  }
}
