import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, query } from '@angular/fire/firestore';
import { Boletim } from 'src/app/interfaces/boletim.interface';

@Component({
  selector: 'app-boletim',
  templateUrl: './boletim.page.html',
  styleUrls: ['./boletim.page.scss'],
})
export class BoletimPage implements OnInit {
  public boletins!: Boletim[];

  constructor(private readonly firestore: Firestore) { }

  ngOnInit() {
    this.getBoletins()
  }

  getBoletins = () => collectionData(
    query(collection(this.firestore, 'boletins'))).subscribe(boletins => this.boletins = boletins as Boletim[]);

}
