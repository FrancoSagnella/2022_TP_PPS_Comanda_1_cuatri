import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Pedido } from 'src/app/clases/pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-id',
  templateUrl: './id.component.html',
  styleUrls: ['./id.component.scss'],
})
export class IdComponent implements OnInit {

  pedido$: Observable<any>;
  table$: Observable<any>
  pedirCuenta:boolean = false;
  propina:number = 0;


  private options = {
    prompt: "Escaneá el QR",
    formats: 'PDF_417, QR_CODE',
    showTorchButton: true,
    resultDisplayDuration: 2,
  };

  constructor(
    private vibration: Vibration,
    private toastr: ToastService,
    private route: ActivatedRoute,
    private pedidoService: PedidoService,
    private router: Router,
    private qrProducto: BarcodeScanner,
    public navCtrl: NavController,
    private pnService:PushNotificationService
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
    this.pnService.enviarNotificacionUsuarios('MOZO', 'Pedido', 'Un cliente realizó un pedido', true);
    this.myWeirdNotification(pedido, 'Pedido registrado con éxito!');
  }

  clickRecibido(pedido: Pedido) {
    pedido.estado = 'CONFIRMADO';
    this.pnService.enviarNotificacionUsuarios('MOZO', 'Pedido', 'Un cliente confirmo la recepcion de un pedido', true);
    this.myWeirdNotification(pedido, 'Gracias por confirmar recepción!');
  }

  clickCobrar(pedido: Pedido) {
    pedido.estado = 'COBRAR';
    this.pnService.enviarNotificacionUsuarios('MOZO', 'Pedido', 'Un cliente pidió la cuenta', true);
    this.myWeirdNotification(pedido, 'Gracias por informar, en breves se le acercará un mozo!');
  }

  clickPedirCuenta()
  {
    this.pedirCuenta = true;
  }

  clickCancelarCuenta()
  {
    this.pedirCuenta = false;
  }

  agregarPropina()
  {
    this.qrProducto.scan(this.options).then(barcodeData => {
      const datos = barcodeData.text;
      switch(datos){
        case 'MALO':
          this.propina = 0;
            break;
        case 'REGULAR':
          this.propina = this.getAcum() * 0.05;
            break;
        case 'BUENO':
          this.propina = this.getAcum() * 0.1;
            break;
        case 'MUY BUENO':
          this.propina = this.getAcum() * 0.15;
            break;
        case 'EXCELENTE':
          this.propina = this.getAcum() * 0.2;
            break;
      }
    });
  }

  setPropinaTestear(datos)
  {
    switch(datos){
      case '0':
        this.propina = 0;
          break;
      case '5':
        this.propina = this.getAcum() * 0.05;
          break;
      case '10':
        this.propina = this.getAcum() * 0.1;
          break;
      case '15':
        this.propina = this.getAcum() * 0.15;
          break;
      case '20':
        this.propina = this.getAcum() * 0.2;
          break;
    }
  }

  getAcum(pedido?: Pedido) {
    let a = 0;
    let b = 0;
    this.getProductsSelected().forEach(p => { a += (p.quantity * p.precio) });

    if(pedido && pedido.descuento10 == 'GANO'){
      b += (a * 0.1);
    }

    if(pedido && pedido.descuento15 == 'GANO'){
      b += (a * 0.15);
    }

    if(pedido && pedido.descuento20 == 'GANO'){
      b += (a * 0.2);
    }

    return a-b;
  }

  getDescontado(pedido:Pedido)
  {
    let a = 0;
    let b=0;
    this.getProductsSelected().forEach(p => { a += (p.quantity * p.precio) });
    if(pedido && pedido.descuento10 == 'GANO'){
      b += (a * 0.1);
    }

    if(pedido && pedido.descuento15 == 'GANO'){
      b += (a * 0.15);
    }

    if(pedido && pedido.descuento20 == 'GANO'){
      b += (a * 0.2);
    }
    return b;
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

  clickJuego10(pedido: Pedido) {
    this.redirectTo('/game/' + pedido.id);
  }

  clickJuego15(pedido: Pedido) {
    this.redirectTo('/juego15/' + pedido.id);
  }

  clickJuego20(pedido: Pedido) {
    this.redirectTo('/juego20/' + pedido.id);
  }



}
