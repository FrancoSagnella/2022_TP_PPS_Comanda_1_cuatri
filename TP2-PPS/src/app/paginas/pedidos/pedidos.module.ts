import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidosRoutingModule } from './pedidos-routing.module';
import { IdComponent } from './id/id.component';
import { ListComponent } from './list/list.component';


@NgModule({
  declarations: [IdComponent, ListComponent],
  imports: [
    CommonModule,
    PedidosRoutingModule
  ]
})
export class PedidosModule { }
