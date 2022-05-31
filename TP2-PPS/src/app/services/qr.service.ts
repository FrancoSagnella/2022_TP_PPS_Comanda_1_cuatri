import { Injectable } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@awesome-cordova-plugins/barcode-scanner/ngx';

@Injectable({
  providedIn: 'root'
})
export class QrService {

  constructor(private barcodeScanner: BarcodeScanner) { }


}
