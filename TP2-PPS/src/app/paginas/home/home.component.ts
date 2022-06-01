import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  public user;

  //  El orden de los links coincide con casosdeuso.jpg
  public links = [

    //  Duenio
    { img: 'assets/pizza.png', url: 'user/register/duenio', profile: 'DUENIO', title: 'Agregar Dueño/Supervisor' },
    { img: 'assets/pizza.png', url: 'mesa/alta', profile: 'DUENIO', title: 'Alta Mesa' },
    { img: 'assets/pizza.png', url: 'user/register/empleado', profile: 'DUENIO', title: 'Agregar Empleado' },
    { img: 'assets/pizza.png', url: 'usuarios/listado', profile: 'DUENIO', title: 'Listado de Usuarios' },
    { img: 'assets/pizza.png', url: 'mesa/list', profile: 'DUENIO', title: 'Listado de Mesas' },

    //  Supervisor
    { img: 'assets/pizza.png', url: 'user/register/duenio', profile: 'SUPERVISOR', title: 'Agregar Empleado' },
    { img: 'assets/pizza.png', url: 'none', profile: 'SUPERVISOR', title: 'Ver Encuestas' },
    // { img: 'assets/images/default.jpg', url: 'none', profile: 'SUPERVISOR', title: 'Crear Encuesta' },

    //  Cocinero
    { img: 'assets/images/product.png', url: 'producto/alta', profile: 'COCINERO', title: 'Agregar Plato/Bebida' },
    { img: 'assets/images/default.jpg', url: 'none', profile: 'COCINERO', title: 'Tomar Pedido' },
    // { img: 'assets/images/encuesta.png', url: 'encuesta/empleado', profile: 'COCINERO', title: 'Encuesta' },

    //  Bartender
    { img: 'assets/images/product.png', url: 'producto/alta', profile: 'BARTENDER', title: 'Agregar Plato/Bebida' },
    { img: 'assets/images/default.jpg', url: 'none', profile: 'BARTENDER', title: 'Tomar Pedido' },
    // { img: 'assets/images/encuesta.png', url: 'encuesta/empleado', profile: 'BARTENDER', title: 'Encuesta' },

    //  Repartidor
    { img: 'assets/images/default.jpg', url: 'none', profile: 'REPARTIDOR', title: 'Mapa Ruta' },
    // { img: 'assets/images/encuesta.png', url: 'encuesta/empleado', profile: 'REPARTIDOR', title: 'Encuesta' },

    //  Mozo
    { img: 'assets/images/cliente-list.png', url: 'user/register/cliente', profile: 'MOZO', title: 'Agregar Cliente' },
    { img: 'assets/images/pedido-list.png', url: 'pedido/list', profile: 'MOZO', title: 'Listar Pedidos' },
    // { img: 'assets/images/encuesta.png', url: 'encuesta/empleado', profile: 'MOZO', title: 'Encuesta' },

    //  Metre
    { img: 'assets/images/cliente-list.png', url: 'user/register/cliente', profile: 'METRE', title: 'Agregar Cliente' },
    { img: 'assets/images/pedido-list.png', url: 'wait/list', profile: 'METRE', title: 'Clientes en Espera' },
    // { img: 'assets/images/encuesta.png', url: 'encuesta/empleado', profile: 'METRE', title: 'Encuesta' },

    //  Cliente
    // { img: 'assets/images/grafico.jpg', url: 'encuesta/cliente/grafico', profile: 'CLIENTE', title: 'Grafico' },

    //  Anonimo
    // { img: 'assets/images/grafico.jpg', url: 'encuesta/cliente/grafico', profile: 'ANONIMO', title: 'Grafico' },
  ];

  constructor(private router: Router,private auth:AuthService) {
    // $("#loadingContainer").attr("hidden", false);
    // setTimeout(() => {
    //   $("#loadingContainer").attr("hidden", true);
    // }, 2000);
    this.user = null;
    this.getUser();
  }

  ngOnInit() {
    // let audio = new Audio('./assets/sounds/noti.mp3');
    // audio.play();
  }

  getUser() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  redirectTo(path: string) {
    // $("#loadingContainer").attr("hidden", false);

    // setTimeout(() => {
    //   $("#loadingContainer").attr("hidden", true);
      this.router.navigate([path]);
    // }, 3000);
  }
}
