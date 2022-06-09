import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoRoutingModule } from './producto-routing.module';
import { AltaComponent } from './alta/alta.component';
import { IdComponent } from './id/id.component';
import { ListaComponent } from './lista/lista.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [AltaComponent,IdComponent,ListaComponent],
  imports: [
    CommonModule,
    ProductoRoutingModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
    


  ]
})
export class ProductoModule { }
