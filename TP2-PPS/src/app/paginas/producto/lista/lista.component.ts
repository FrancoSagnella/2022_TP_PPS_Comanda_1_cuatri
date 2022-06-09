import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Producto } from 'src/app/clases/producto';
import { PedidoService } from 'src/app/services/pedido.service';
import { ProductoService } from 'src/app/services/producto.service';
@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
})
export class ListaComponent implements OnInit {

  user;
  productsSelected: any[] = [];

  list$: Observable<any>;
  pedido$: Observable<any>;

  kyndSelected;
  kynds = [
    { val: 'Comida', img: 'assets/images/default.png' },
    { val: 'Bebida', img: 'assets/images/default.png' },
    { val: 'Postre', img: 'assets/images/default.png' },
  ]

  constructor(
    private productoService: ProductoService,
    private pedidoService: PedidoService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.kyndSelected = this.kynds[0];
    this.getUser();
    this.getPedido();

    this.getList('sdfjukhjhggvg :)');

    //  If user wanna set something
    this.checkProductsSelected();
  }

  getQuantity(model: Producto) {
    let quantity = 0;

    if (this.productsSelected) {
      this.productsSelected.forEach(p => {

        if (p.id == model.id) {
          quantity = p.quantity;
        }
      });
    }
    return quantity;
  }

  private checkProductsSelected() {
    let a = JSON.parse(localStorage.getItem('products'));
    if (a) { this.productsSelected = a; }
  }

  private getUser() {
    this.user = null;
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  private getPedido() {
    this.pedido$ = this.pedidoService.getLastByUser(this.user.correo);
  }

  setFilter(p) {
    this.kyndSelected = p;
    this.getList(p.val);
  }

  getList(filter: string) {
    switch (filter) {
      case 'Postre':
        this.list$ = this.productoService.getPostres();
        break;

      case 'Bebida':
        this.list$ = this.productoService.getBebidas();
        break;

      default:
        this.list$ = this.productoService.getComidas();
        break;
    }
  }

  redirectTo(path: string) {
    this.router.navigate([path]);
  }

  //  Model es Producto, pero desps tengo ganas de agregarle un campo llamado quantity.
  setQuantity(model: any, action: '+' | '-') {

    if (action == '+') {
      model.quantity = this.getQuantity(model) + 1;
    }
    else {
      const quaa = this.getQuantity(model) - 1;
      if (quaa == -1) { model.quantity = 0; }
      else { model.quantity = quaa; }
    }

    if (model.quantity == 0) {
      let a = this.productsSelected.find(x => x.id == model.id);
      let index = this.productsSelected.indexOf(a);
      this.productsSelected.splice(index, 1);
    }
    else {
      this.productsSelected.push(model);
    }

  }

  getAcum() {
    let a = 0;
    this.productsSelected.forEach(p => { a += (p.quantity * p.precio); });
    return a;
  }

  clickBeforeConfirm() {
    localStorage.setItem('products', JSON.stringify(this.productsSelected));

    const a = this.pedido$.subscribe(data => {
      this.redirectTo('pedido/id/' + data.id);
      a.unsubscribe();
    });
  }

  clickDetails(model: Producto) {
    this.redirectTo('producto/id/' + model.id);
  }

  getAproxFinish() {
    let minutos: number = 0;
    this.productsSelected.forEach(p => { minutos += p.tiempo; });
    return minutos;
  }
  
}
