import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { AltaDuenioSupervisorComponent } from './altas/alta-duenio-supervisor/alta-duenio-supervisor.component';


@NgModule({
  declarations: [AltaDuenioSupervisorComponent],
  imports: [
    CommonModule,
    UsuariosRoutingModule
  ]
})
export class UsuariosModule { }
