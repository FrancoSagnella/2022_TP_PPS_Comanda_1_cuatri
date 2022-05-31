import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Cliente } from '../clases/cliente';
import { Duenio } from '../clases/duenio';
import { Supervisor } from '../clases/supervisor';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  coleccion = 'usuarios';
  referencia: AngularFirestoreCollection;

  constructor(private bd: AngularFirestore) {
    this.referencia = this.bd.collection<Duenio | Supervisor | Cliente>
      (this.coleccion, ref => ref.orderBy('fechaCreacion', 'asc'));
  }

  public async alta(model: Duenio | Supervisor | Cliente ) {
    try {
      model.id = this.bd.createId();
      const result = this.referencia.doc(model.id).set({ ...model });
      return result;
    }
    catch (err) { console.log(err); }
  }
}
