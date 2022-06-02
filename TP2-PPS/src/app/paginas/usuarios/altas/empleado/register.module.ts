import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RegisterPageRoutingModule } from './register-routing.module';
import { RegisterPage } from './register.page';

import { Vibration } from '@ionic-native/vibration/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegisterPageRoutingModule
  ],
  declarations: [RegisterPage],
  providers: [Vibration]
})
export class RegisterPageModule { }
