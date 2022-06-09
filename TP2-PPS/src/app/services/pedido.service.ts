import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pedido } from '../clases/pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  pathOfCollection = 'pedidos';
  referenceToCollection: AngularFirestoreCollection;

  constructor(private bd: AngularFirestore) {
    this.referenceToCollection =
      this.bd.collection<Pedido>
        (this.pathOfCollection, ref => ref.orderBy('date_created', 'asc'));
  }

  public async createOne(model: Pedido) {
    try {
      model.id = this.bd.createId();
      return await this.referenceToCollection.doc(model.id).set({ ...model });  //  llaves es objeto, 3 puntitos es dinamico
    }
    catch (err) { console.log(err); }
  }

  public async setOne(model: Pedido) {
    try { return this.referenceToCollection.doc(model.id).set({ ...model }); }
    catch (err) { console.log(err); }
  }

  getInactivos() {
    try {
      return this.getAll().pipe(
        map
        (requests => requests.filter(
          u => u.estado == 'CANCELADO' || u.estado == 'FINALIZADO' ||
            u.estado == 'COBRADO' || u.estado == 'ENCUESTADO'
        )));
    }
    catch (error) { }
  }

  getActivos() {
    try {
      return this.getAll().pipe(
        map(requests => requests.filter(
          u => u.estado == 'PENDIENTE' || u.estado == 'ACEPTADO' ||
            u.estado == 'CONFIRMADO' || u.estado == 'COBRAR'
        )));
    }
    catch (error) { }
  }

  getPendientes() {
    return this.getByStatus('PENDIENTE') as Observable<Pedido[]>;
  }

  getCancelados() {
    return this.getByStatus('CANCELADO') as Observable<Pedido[]>;
  }

  getAceptados() {
    return this.getByStatus('ACEPTADO') as Observable<Pedido[]>;
  }

  getConfirmados() {
    return this.getByStatus('CONFIRMADO') as Observable<Pedido[]>;
  }

  getToCobrar() {
    return this.getByStatus('COBRAR') as Observable<Pedido[]>;
  }

  getCobrados() {
    return this.getByStatus('COBRADO') as Observable<Pedido[]>;
  }

  getEncuestados() {
    return this.getByStatus('ENCUESTADO') as Observable<Pedido[]>;
  }

  private getByStatus(estado: string) {
    try {
      return this.getAll().pipe(
        map(pedidos => pedidos.filter(u => u.estado.includes(estado))));
    }
    catch (error) { }
  }

  getAll() {
    try {
      return this.referenceToCollection.snapshotChanges().pipe(
        map(pedidos => pedidos.map(a => a.payload.doc.data()))
      );
    }
    catch (error) { }
  }

  getById(id: string) {
    try {
      return this.getAll().pipe(
        map(pedidos => pedidos.find(u => u.id == id)));
    }
    catch (error) { }
  }

  getByUser(correo: string, estado?: string) {
    try {
      if (!estado) {
        return this.getAll().pipe(
          map(pedidos => pedidos.filter(u => u.correo == correo)));
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
      map(pedidos => pedidos.slice(-1)[0]));
  }
}
