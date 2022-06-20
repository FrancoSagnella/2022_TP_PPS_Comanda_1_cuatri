import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Anonimo } from '../clases/anonimo';
import { Cliente } from '../clases/cliente';
import { Duenio } from '../clases/duenio';
import { Empleado } from '../clases/empleado';
import { Supervisor } from '../clases/supervisor';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  coleccion = 'usuarios';
  referencia: AngularFirestoreCollection;

  constructor(private bd: AngularFirestore) {
    this.referencia = this.bd.collection<Duenio | Supervisor | Cliente | Empleado | Anonimo>
      (this.coleccion, ref => ref.orderBy('fechaCreacion', 'asc'));
  }

  public async alta(model: Duenio | Supervisor | Cliente | Empleado | Anonimo ) {
    try {
      model.id = this.bd.createId();
      const result = this.referencia.doc(model.id).set({ ...model });
      return result;
    }
    catch (err) { console.log(err); }
  }

  public async setOne(model: Duenio | Supervisor | Cliente ) {
    try {
      return this.referencia.doc(model.id).set({ ...model }); }
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

  getMozos() {
    return this.getByRol('MOZO') as Observable<Empleado[]>;
  }

  getCocineros() {
    return this.getByRol('COCINERO') as Observable<Empleado[]>;
  }

  getMetres() {
    return this.getByRol('METRE') as Observable<Empleado[]>;
  }

  public getByRol(rol: string) {
    try {
      return this.getAll().pipe(
        map(users => users.filter(u => u.rol.includes(rol))));
    }
    catch (error) { }
  }

  public getByPerfil(perfil: string) {
    try {
      return this.getAll().pipe(
        map(users => users.filter(u => u.perfil.includes(perfil))));
    }
    catch (error) { }
  }

  getAll() {
    try {
      return this.referencia.snapshotChanges().pipe(
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
