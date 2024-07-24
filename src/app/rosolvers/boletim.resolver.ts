import { Injectable } from "@angular/core";
import { Firestore, doc, docData } from "@angular/fire/firestore";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Boletim } from "../interfaces/boletim.interface";

@Injectable({
    providedIn: 'root'
})
export class BoletimResolver implements Resolve<Boletim> {

    constructor(private readonly firestore: Firestore)  { }

    resolve = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Boletim> =>
        docData(doc(this.firestore, `boletins/${route.paramMap.get('id')}`)) as Observable<Boletim>;
}