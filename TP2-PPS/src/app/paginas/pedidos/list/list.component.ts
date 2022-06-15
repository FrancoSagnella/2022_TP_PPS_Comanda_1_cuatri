import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Mesa } from 'src/app/clases/mesa';
import { Pedido } from 'src/app/clases/pedido';
import { Producto } from 'src/app/clases/producto';
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

  public user;
  requests$: Observable<any>;

  tables: any;
  waits: any;

  kyndSelected;
  kynds = [
    { val: 'Activos', img: 'assets/images/default.png' },
    { val: 'Inactivos', img: 'assets/images/default.png' },
  ];


  constructor(
    private reqService: PedidoService,
    private tblService: MesaService,
    private waitService: WaitService,
    private toastr: ToastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getUser();
    this.kyndSelected = this.kynds[0];
    this.getRequests(this.kyndSelected.val);


    //  es una mierda esta parte..
    this.getAllTables();
    this.getAllWaits();
  }

  setFilter(p) {
    this.kyndSelected = p;
    this.getRequests(p.val);
  }

  private getAllTables() {
    this.tblService.getAll().subscribe(data => {
      this.tables = data;
    })
  }

  private getAllWaits() {
    this.waitService.getAll().subscribe(data => {
      this.waits = data;
    })
  }

  getRequests(filter: string) {
    switch (filter) {
      case 'Inactivos':
        this.requests$ = this.reqService.getInactivos();
        break;

      default:
        this.requests$ = this.reqService.getActivos();
        break;
    }
  }

  getTotal(model: any) {
    let a = 0;

    model.producto_id.forEach(p => {
      a += p.precio
    });

    if (model.descuento == 'GANO') {
      a = a - (a * 0.1);
    }

    return a;
  }

  setStatus(model: Pedido, status) {
    model.estado = status;
    model.date_updated = new Date().getTime();

    try {
      this.reqService.setOne(model);

      if (model.estado == 'COBRADO') {

        this.waits.reverse().forEach(t => {
          if (t.correo == model.correo) {
            this.setStatusWait(t);
          }
        });

        this.tables.forEach(t => {
          if (t.numero == model.mesa_numero) {
            this.setStatusTable(t);

            // let audio = new Audio('./assets/sounds/noti.mp3');
            // audio.play();
            this.toastr.presentToast('La mesa Nro: '+t.numero+' se encuantra disponible', 2000, 'success', 'Estado del pedido');
            // this.toastr.success('Datos registrados, ahora la mesa Nº ' + t.numero + ' está Disponible', 'Estado de Pedido');
          }
        });
      }
    }
    catch (error) {
      this.toastr.presentToast('Error al cambiar estado', 2000, 'danger', 'Estado del pedido');
      // this.toastr.error('Error inesperado al momento de cambiar estado del pedido', 'Acción')
    }
  }

  private setStatusTable(mesa: Mesa) {
    mesa.estado = 'DISPONIBLE';
    this.tblService.setOne(mesa,'');
  }

  private setStatusWait(waitzzz: WaitList) {
    waitzzz.estado = 'FINALIZADO';
    this.waitService.setOne(waitzzz);
  }

  getQuestion(status: string) {
    switch (status) {
      case 'PENDIENTE':
        return '¿Aceptar?';
      case 'COBRAR':
        return '¿Pagó?';
      default:
        return '';
    }
  }

  clickDetails(model: Producto) {
    this.redirectTo('producto/id/' + model.id);
  }

  redirectTo(path: string) {
    this.router.navigate([path]);
  }

  getUser() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }
}
