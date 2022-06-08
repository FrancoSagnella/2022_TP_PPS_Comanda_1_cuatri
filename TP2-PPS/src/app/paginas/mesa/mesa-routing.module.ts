import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AltaComponent } from './alta/alta.component';
import { ListaComponent } from './lista/lista.component';

const routes: Routes = [
  {path:'alta', component:AltaComponent},
  {path:'lista', component:ListaComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MesaRoutingModule { }
