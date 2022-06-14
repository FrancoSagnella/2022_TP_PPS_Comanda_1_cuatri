import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Pedido } from 'src/app/clases/pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-id',
  templateUrl: './id.component.html',
  styleUrls: ['./id.component.scss'],
})
export class IdComponent implements OnInit {

  pedido$: Observable<any>;
  table$: Observable<any>

  constructor(
    private vibration: Vibration,
    private toastr: ToastService,
    private route: ActivatedRoute,
    private pedidoService: PedidoService,
    private router: Router,
    private qrProducto: BarcodeScanner,
    public navCtrl: NavController

  ) {

  }

  ngOnInit() {
    this.getPedido();
  }

  getPedido() {
    const id = this.route.snapshot.paramMap.get('id');
    this.pedido$ = this.pedidoService.getById(id);
  }

  getProductsSelected() {
    return JSON.parse(localStorage.getItem('products'));
  }

  clickPendiente(pedido: Pedido) {
    pedido.producto_id = this.getProductsSelected();
    this.myWeirdNotification(pedido, 'Pedido registrado con éxito!');
  }

  clickRecibido(pedido: Pedido) {
    pedido.estado = 'CONFIRMADO';
    this.myWeirdNotification(pedido, 'Gracias por confirmar recepción!');
  }

  clickCobrar(pedido: Pedido) {
    pedido.estado = 'COBRAR';
    this.myWeirdNotification(pedido, 'Gracias por informar, en breves se le acercará un mozo!');
  }

  getAcum(pedido?: Pedido) {
    let a = 0;

    this.getProductsSelected().forEach(p => { a += (p.quantity * p.precio) });

    if(pedido && pedido.descuento == 'GANO'){
      a = a - (a * 0.1);
    }

    return a;
  }

  redirectTo(path: string) {
    this.router.navigate([path]);
  }

  private myWeirdNotification(new_pedido: Pedido, message: string) {
    try {
      new_pedido.date_updated = new Date().getTime();
      this.pedidoService.setOne(new_pedido);

      this.vibration.vibrate([500]);

      // let audio = new Audio('./assets/sounds/noti.mp3');
      //         audio.play();

      this.redirectTo('/home');
      this.toastr.presentToast(message, 2000, 'success', 'Estado del pedido');
      // this.toastr.success(message, 'Estado de Pedido');
    }
    catch (error) {
      this.vibration.vibrate([500, 500, 500]);
      this.toastr.presentToast('Error al registrar pedido', 2000, 'danger', 'Estado del pedido');
      // this.toastr.error('Error inesperado al momento de registrar su pedido!', 'Estado de Pedido');
    }
  }

  getAproxFinish() {
    let minutes: number = 0;
    this.getProductsSelected().forEach(p => { minutes += p.tiempo; });
    return minutes;
  }

  getTitle(status: string) {
    switch (status) {
      case 'PENDIENTE':
        return 'Confirmar Pedido';

      case 'ACEPTADO':
        return 'Confirmar Recepción a su Mesa';

      case 'CONFIRMADO':
        return 'Pedir Cuenta para Pagar';

      case 'COBRAR':
        return 'Confirmar Pago Efectuado';

      case 'COBRAR':
        return 'Realizar Encuesta';

      case 'COBRADO':
        return 'Recomendación del Cliente';

      default:
        return '';
    }
  }

  AddProducto(index: number) {

  }
  RemoveProducto(nombre: string, index: number) { }
  /* AddProducto(index:number){
     this.productos[index].selected = true;
     this.productos[index].cantidad++;
     this.total += this.productos[index].precio;
     this.CalcularDemora();
   }
   RemoveProducto(nombre:string,index:number){
      if(this.productos[index].cantidad > 0){
        this.productos[index].cantidad--;
        if(this.productos[index].cantidad == 0){
         this.productos[index].selected = false;
        }
        this.total -= this.productos[index].precio;
        this.CalcularDemora();
      }
   }*/

  navigateBack() {
    this.navCtrl.back();
  }

  ScanQr() {
    const options = {
      prompt: "Escaneá el producto",
      formats: 'QR_CODE',
      showTorchButton: true,
      resultDisplayDuration: 2,
    };

    this.qrProducto.scan(options).then(data => {
      this.AgregarConQr(data.text);
    }).catch(err => {
      console.log(err);
    });
  }

  AgregarConQr(textqr: string) {

    /* let obj = this.productos.findIndex( x => x.doc_id == textqr);
     if (obj !== -1) {
       console.log(obj)
       this.saveProdIndex = obj;
       console.log(this.saveProdIndex)
       this.openModal(this.productos[obj])
     } else {
       this.toastSrv.error("No se encontro el producto buscado..",'Pedir producto');
      alert("No se encontro el producto buscado..");
     }*/
  }

  clickJuego(pedido: Pedido) {
    this.redirectTo('/game/' + pedido.id);
  }


}
