import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EncuestaRoutingModule } from './encuesta-routing.module';
import { ClienteComponent } from './cliente/cliente.component';
import { EmpleadoComponent } from './empleado/empleado.component';
import { GraficoClienteComponent } from './grafico-cliente/grafico-cliente.component';
import { Supervisor } from 'src/app/clases/supervisor';
import { SupervisorComponent } from './supervisor/supervisor.component';


@NgModule({
  declarations: [ClienteComponent,EmpleadoComponent,GraficoClienteComponent,SupervisorComponent],
  imports: [
    CommonModule,
    EncuestaRoutingModule
  ]
})
export class EncuestaModule { }
