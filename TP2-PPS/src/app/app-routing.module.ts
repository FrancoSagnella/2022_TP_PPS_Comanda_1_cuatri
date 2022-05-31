import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AltaClienteComponent } from './componentes/alta-cliente/alta-cliente.component';

const routes: Routes = [
  {path:'bienvenida', component:AppComponent},
  {path:'altaCliente', component:AltaClienteComponent},
  {path:'**', redirectTo:'bienvenida', pathMatch:'full'}
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
