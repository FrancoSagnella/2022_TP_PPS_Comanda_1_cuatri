import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AltaClienteComponent } from './altas/alta-cliente/alta-cliente.component';
import { AltaDuenioSupervisorComponent } from './altas/alta-duenio-supervisor/alta-duenio-supervisor.component';
import { ListadoComponent } from './listado/listado.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path:'altaDuenio', component:AltaDuenioSupervisorComponent},
  {path:'altaCliente', component:AltaClienteComponent},
  {path:'login', component:LoginComponent},
  {path:'listado', component:ListadoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
