import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Anonimo } from '../models/anonimo';
import { Cliente } from '../models/cliente';
import { Duenio } from '../models/duenio';
import { Empleado } from '../models/empleado';
import { Supervisor } from '../models/supervisor';
import { combineLatest, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  pathOfCollection = 'users';
  referenceToCollection: AngularFirestoreCollection;

  constructor(private bd: AngularFirestore) {
    this.referenceToCollection =
      this.bd.collection<Duenio | Supervisor | Cliente | Empleado | Anonimo>
        (this.pathOfCollection, ref => ref.orderBy('fecha_creacion', 'asc'));
  }

  public async createOne(model: Duenio | Supervisor | Cliente | Empleado | Anonimo) {
    try {
      model.id = this.bd.createId();
      const result = this.referenceToCollection.doc(model.id).set({ ...model });  //  llaves es objeto, 3 puntitos es dinamico
      return result;
    }
    catch (err) { console.log(err); }
  }

  public async setOne(model: Duenio | Supervisor | Cliente | Empleado | Anonimo) {
    try { 
      return this.referenceToCollection.doc(model.id).set({ ...model }); }
    catch (err) { console.log(err); }
  }

  getDuenios() {
    return this.getByPerfil('DUENIO') as Observable<Duenio[]>;
  }

  getSupervisores() {
    return this.getByPerfil('SUPERVISOR') as Observable<Supervisor[]>;
  }

  getClientes() {
    return this.getByPerfil('CLIENTE') as Observable<Cliente[]>;
  }

  getEmpleados() {
    return this.getByPerfil('EMPLEADO') as Observable<Empleado[]>;
  }

  getAnonimos() {
    return this.getByPerfil('ANONIMO') as Observable<Anonimo[]>;
  }

  private getByPerfil(perfil: string) {
    try {
      return this.getAll().pipe(
        map(users => users.filter(u => u.perfil.includes(perfil))));
    }
    catch (error) { }
  }

  getAll() {
    try {
      return this.referenceToCollection.snapshotChanges().pipe(
        map(users => users.map(a => a.payload.doc.data()))
      );
    }
    catch (error) { }
  }

  getByEmail(email: string) {
    try {
      return this.getAll().pipe(
        map(users => users.find(u => u.correo == email)));
    }
    catch (error) { }
  }
}