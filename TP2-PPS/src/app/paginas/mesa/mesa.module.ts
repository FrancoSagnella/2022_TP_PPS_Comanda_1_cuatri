import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MesaRoutingModule } from './mesa-routing.module';
import { AltaComponent } from './alta/alta.component';
import { ListaComponent } from './lista/lista.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Vibration } from '@ionic-native/vibration/ngx';


@NgModule({
  declarations: [AltaComponent, ListaComponent],
  imports: [
    CommonModule,
    MesaRoutingModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ],
  providers:[Vibration]
})
export class MesaModule { }
