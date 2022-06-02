import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { AltaDuenioSupervisorComponent } from './altas/alta-duenio-supervisor/alta-duenio-supervisor.component';
import { AltaClienteComponent } from './altas/alta-cliente/alta-cliente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { IonicModule } from '@ionic/angular';
import { ListadoComponent } from './listado/listado.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';


@NgModule({
  declarations: [AltaDuenioSupervisorComponent, AltaClienteComponent, ListadoComponent, LoginComponent, LogoutComponent],
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
