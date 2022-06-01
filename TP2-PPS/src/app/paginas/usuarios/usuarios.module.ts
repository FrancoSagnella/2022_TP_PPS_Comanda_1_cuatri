import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { AltaDuenioSupervisorComponent } from './altas/alta-duenio-supervisor/alta-duenio-supervisor.component';
import { AltaClienteComponent } from './altas/alta-cliente/alta-cliente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { IonicModule } from '@ionic/angular';
import { LoginComponent } from './login/login.component';
import { ListadoComponent } from './listado/listado.component';


@NgModule({
  declarations: [AltaDuenioSupervisorComponent, AltaClienteComponent, LoginComponent, ListadoComponent],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
    IonicModule,
  ]
})
export class UsuariosModule { }
