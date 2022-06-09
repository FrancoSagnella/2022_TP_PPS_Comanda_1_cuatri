import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { WaitList } from '../clases/waitList';

@Injectable({
  providedIn: 'root'
})
export class WaitService {
  pathOfCollection = 'wait_list';
  referenceToCollection: AngularFirestoreCollection;

  constructor(private bd: AngularFirestore) {
    this.referenceToCollection =
      this.bd.collection<WaitList>
        (this.pathOfCollection, ref => ref.orderBy('date_created', 'asc'));
  }

  public async createOne(model: WaitList) {
    try {
      model.id = this.bd.createId();
      return await this.referenceToCollection.doc(model.id).set({ ...model });  //  llaves es objeto, 3 puntitos es dinamico
    }
    catch (err) { console.log(err); }
  }

  public async setOne(model: WaitList) {
    try { return this.referenceToCollection.doc(model.id).set({ ...model }); }
    catch (err) { console.log(err); }
  }

  getInactivos() {
    try {
      return this.getAll().pipe(
        map(waits => waits.filter(
          u => u.estado == 'CANCELADO' || u.estado == 'FINALIZADO'
        )));
    }
    catch (error) { }
  }

  getActivos() {
    try {
      return this.getAll().pipe(
        map(waits => waits.filter(
          u => u.estado == 'PENDIENTE' || u.estado == 'EN USO'
        )));
    }
    catch (error) { }
  }

  getAll() {
    try {
      return this.referenceToCollection.snapshotChanges().pipe(
        map(waits => waits.map(a => a.payload.doc.data()))
      );
    }
    catch (error) { }
  }

  getById(id: string) {
    try {
      return this.getAll().pipe(
        map(tables => tables.find(u => u.id == id)));
    }
    catch (error) { }
  }

  getByUser(correo: string, estado?: string) {
    try {
      if (!estado) {
        return this.getAll().pipe(
          map(tables => tables.filter(u => u.correo == correo)));
      }
      else {
        return this.getAll().pipe(
          map(tables => tables.filter(
            u => u.correo == correo && u.estado == estado
          )));
      }
    }
    catch (error) { }
  }

  getLastByUser(correo: string, estado?: string) {
    return this.getByUser(correo, estado).pipe(
      map(tables => tables.slice(-1)[0]));
  }
}
