import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { WaitList } from 'src/app/clases/waitList';
import { PedidoService } from 'src/app/services/pedido.service';
import { ToastService } from 'src/app/services/toast.service';
import { WaitService } from 'src/app/services/wait.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
})
export class ScannerComponent implements OnInit, OnDestroy {

  public user;
  public hasWait;
  public hasRequest;

  private data: any;

  private options = {
    prompt: "Escaneá el QR",
    formats: 'PDF_417, QR_CODE',
    showTorchButton: true,
    resultDisplayDuration: 2,
  };

  constructor(
    private toastr: ToastService,
    private router: Router,
    private waitService: WaitService,
    private requestService: PedidoService,
    private barcodeScanner: BarcodeScanner
  ) { }

  ngOnInit() {
    this.user = null;
    this.data = null;
    this.getUser();

    this.checkWait();
    this.checkRequest();
  }

  verProductos() {
    this.router.navigate(['/producto/list']);
  }

  ngOnDestroy() {
    this.data = null;
  }

  getUser() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  private checkWait() {
    const a = this.waitService.getLastByUser(this.user.correo)
      .subscribe(data => {
        this.hasWait = data;
      });
  }

  private checkRequest() {
    const a = this.requestService.getLastByUser(this.user.correo)
      .subscribe(data => {
        this.hasRequest = data;
      });
  }

  async scannQR() {
    this.barcodeScanner.scan(this.options).then(barcodeData => {
      const datos = barcodeData.text.split(' ');
      this.data = { name: datos[0], id: datos[1], }

      // this.data = { name: 'MESA', id: 1 }; //  Pruebas unitarias

      if (this.data) {
        switch (this.data.name) {
          case 'ENTRADA':
            if (!this.hasWait) {
              this.addToWaitList();
            }
            else if (this.hasWait.estado == 'PENDIENTE') {
              // this.toastr.warning('Previamente usted ya solicitó una mesa, en breves se le acercará un recepcionista', 'Lista de espera');
            }
            else if (this.hasWait.estado == 'EN USO') {
              // this.toastr.warning('Usted ya tiene una mesa reservada, por favor consulte al empleado más cercano', 'Lista de espera');
            }
            else if (this.hasWait.estado == 'FINALIZADO') {
              this.addToWaitList();
            }
            break;

          case 'MESA':
            if (!this.hasRequest) { //  If first time in restaurant
              // this.toastr.warning('Lo sentimos, primero debe anunciarse en recepción', 'QR');
            }
            else if (this.hasRequest.mesa_numero == this.data.id) {
              switch (this.hasRequest.estado) {
                case 'PENDIENTE':
                  this.router.navigate(['/producto/list']);
                  break;

                case 'ACEPTADO':
                  this.router.navigate(['/pedido/id/' + this.hasRequest.id]);
                  break;

                case 'CONFIRMADO':
                  this.router.navigate(['/pedido/id/' + this.hasRequest.id]);
                  break;

                case 'COBRAR':
                  // this.toastr.warning('En breves se le acercará un mozo a cobrarle', 'QR');
                  break;

                case 'COBRADO':
                  if ((new Date().getTime() - this.hasRequest.date_updated) >= (10 * 60 * 60 * 1000)) {  //  If pass 10 hours of last pedido
                    // this.toastr.warning('La mesa que se le asignó es: Nº ' + this.hasRequest.mesa_numero, 'QR');
                  }
                  else {  //  If is the table selected
                    this.router.navigate(['/pedido/id/' + this.hasRequest.id]);
                  }
                  break;

                default:
                  // this.toastr.warning('Le recomendamos que se dirija a recepción para que le asigne una mesa', 'QR');
                  break;
              }
            }
            break;

          default:
            // this.toastr.warning('QR no perteneciente a ARM-Restaurante..', 'QR');
            break;
        }
      }
    });
  }

  private addToWaitList() {
    try {
      const m = this.createModelWait();
      this.waitService.createOne(m);

      // this.toastr.success('Aguarde un instante, en breves se le asignará una mesa!', 'Lista de Espera');
    }
    catch (error) {
      // this.toastr.error('Error al momento de ingresarlo en lista de espera', 'Lista de espera');
    }
  }

  private createModelWait() {
    let m: WaitList = {
      id: '',
      estado: 'PENDIENTE',
      correo: this.user.correo,
      date_created: new Date().getTime()
    }

    return m;
  }

}
