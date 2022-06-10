import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Observable } from 'rxjs';
import { Mesa } from 'src/app/clases/mesa';
import { Pedido } from 'src/app/clases/pedido';
import { WaitList } from 'src/app/clases/waitList';
import { MesaService } from 'src/app/services/mesa.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ToastService } from 'src/app/services/toast.service';
import { WaitService } from 'src/app/services/wait.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  waitSelected;

  waits$: Observable<any>;
  tables$: Observable<any>;

  kyndSelected;
  kynds = [
    { val: 'Activos', img: 'assets/images/default.png' },
    { val: 'Inactivos', img: 'assets/images/default.png' },
  ];

  constructor(
    private router: Router,
    private vibration: Vibration,
    private toastr: ToastService,
    private tableService: MesaService,
    private waitService: WaitService,
    private pedidoService: PedidoService,
  ) { }

  ngOnInit() {
    this.kyndSelected = this.kynds[0];
    this.getWaits(this.kyndSelected.val);
    this.getTables();
  }

  setFilter(p) {
    this.kyndSelected = p;
    this.getWaits(p.val);
  }

  getTables() {
    this.tables$ = this.tableService.getByStatus('DISPONIBLE');
  }

  getWaits(filter: string) {
    switch (filter) {

      case 'Inactivos':
        this.waits$ = this.waitService.getInactivos();
        break;

      default:
        this.waits$ = this.waitService.getActivos();
        break;
    }
  }

  clickRequest(model: WaitList) {
    this.waitSelected = model;
  }

  clickConfirm(model: Mesa) {
    this.waitSelected.estado = 'EN USO';
    this.waitService.setOne(this.waitSelected);

    model.estado = 'RESERVADO';
    this.tableService.setOne(model,this.waitSelected.user_uid);

    let p: Pedido = this.createModelPedido(model);
    this.pedidoService.createOne(p);

    // let audio = new Audio('./assets/sounds/noti.mp3');
    // audio.play();
    // this.toastr.success('Datos guardados con éxito! mesa Nº ' + model.numero + ' se encuentra en uso', 'Aceptación de Pedido');
    this.vibration.vibrate([500]);
    this.waitSelected = null;
  }

  clickCancel(model: WaitList) {
    model.estado = 'CANCELADO';
    this.waitService.setOne(model);

    const a = this.pedidoService.getLastByUser(model.correo).subscribe((data: Pedido) => {
      if (data) {
        data.date_updated = new Date().getTime();
        data.estado = 'CANCELADO';

        const b = this.tableService.getByNumber(data.mesa_numero).subscribe((mesa: Mesa) => {
          mesa.estado = 'DISPONIBLE';
          this.tableService.setOne(mesa,'');
          b.unsubscribe();
        });

        this.pedidoService.setOne(data);
        a.unsubscribe();
      }
    });

    // let audio = new Audio('./assets/sounds/noti.mp3');
    // audio.play();
    // this.toastr.success('Datos guardados con éxito!', 'Cancelación de Pedido');
    this.vibration.vibrate([500]);
    this.waitSelected = null;
  }

  clickBack() {
    this.waitSelected = null;
  }

  redirectTo(path: string) {
    this.router.navigate([path]);
  }

  private createModelPedido(mesa: Mesa) {
    let m: Pedido = {
      id: '',
      correo: this.waitSelected.correo,
      mesa_numero: mesa.numero,
      producto_id: null,
      date_created: new Date().getTime(),
      date_updated: new Date().getTime(),
      estado: 'PENDIENTE',
      descuento: 'NO JUGO'
    }
    return m;
  }
}
