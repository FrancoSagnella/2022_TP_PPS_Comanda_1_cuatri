import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AltaClienteComponent } from './altas/alta-cliente/alta-cliente.component';
import { AltaDuenioSupervisorComponent } from './altas/alta-duenio-supervisor/alta-duenio-supervisor.component';
import { ListadoComponent } from './listado/listado.component';

const routes: Routes = [
  {path:'altaDuenio', component:AltaDuenioSupervisorComponent},
  {path:'altaCliente', component:AltaClienteComponent},
  {path:'listado', component:ListadoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
