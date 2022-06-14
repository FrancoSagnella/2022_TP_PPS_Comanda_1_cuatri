import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteComponent } from './cliente/cliente.component';
import { EmpleadoComponent } from './empleado/empleado.component';
import { GraficoClienteComponent } from './grafico-cliente/grafico-cliente.component';
import { SupervisorComponent } from './supervisor/supervisor.component';

const routes: Routes = [
  {path:'cliente',component:ClienteComponent},
  {path:'cliente/grafico',component:GraficoClienteComponent},
  {path:'empleado',component:EmpleadoComponent},
  {path:'supervisor',component:SupervisorComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EncuestaRoutingModule { }
