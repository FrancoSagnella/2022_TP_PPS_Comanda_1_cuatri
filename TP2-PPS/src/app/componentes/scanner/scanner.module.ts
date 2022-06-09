import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScannerComponent } from './scanner.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [ScannerComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports:[
    ScannerComponent
  ]
})
export class ScannerModule { }
