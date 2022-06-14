import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IdComponent } from './id/id.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {path:'id/:id', component:IdComponent},
  {path:'list', component:ListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidosRoutingModule { }
