import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AltaClienteComponent } from './altas/alta-cliente/alta-cliente.component';
import { AltaDuenioSupervisorComponent } from './altas/alta-duenio-supervisor/alta-duenio-supervisor.component';
import { ListadoComponent } from './listado/listado.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
  {path:'altaDuenio', component:AltaDuenioSupervisorComponent},
  {path:'altaCliente', component:AltaClienteComponent},
  {path:'listado', component:ListadoComponent},
  {path:'login', component:LoginComponent},
  {path:'logout', component:LogoutComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
