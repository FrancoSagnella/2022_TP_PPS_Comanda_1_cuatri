import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'src/app/clases/mensaje';
import { eRol } from 'src/app/enums/eRol';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { MesaClienteService } from 'src/app/services/mesa-cliente.service';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-chat-mozo',
  templateUrl: './chat-mozo.component.html',
  styleUrls: ['./chat-mozo.component.scss'],
})
export class ChatMozoComponent implements OnInit {

  mesasCliente: any;
  currentMesaCliente: any;
  currentUser: any; //puede ser mozo o cliente
  currentUid:string;
  title:string;

  chatForm: FormGroup;
  mensaje:string;
  mensajes:Message[];
  showSpinner:boolean;
  bgSala:string;
  constructor(
    private authService:AuthService,
    private router:Router ,
    private mjeService: ChatService,
    private fb:FormBuilder  ) {
      this.mensaje="";
      this.bgSala = "container cont-chat";
      this.mensajes=[];
    }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.currentUid = this.authService.getUid();

    this.mjeService.traerMensajes().subscribe((data) => {

      this.mensajes = data;
      this.mensajes.sort();

      console.log(data);
    });



    this.chatForm = this.fb.group({
      messageCtrl:['', [Validators.required]],
    });

  }

  return(){
    this.router.navigate(["home"]);
  }


  enviarMje(){
    var mje: Message =  {
      message :  this.mensaje,
      userEmail : this.currentUser.correo,
      fecha: Date.now(),
      userName:this.currentUser.nombre + ' ' + this.currentUser.apellido,



      uid: this.currentUser.id,
      rol:  this.currentUser.perfil == eRol.CLIENTE? "Cliente" : "Mozo"

    };

    this.mjeService.setItemWithId(mje, mje.fecha.toString())
    .then(() => {
      if(this.currentUser.perfil == eRol.CLIENTE){

      //  alert("mensaje nuevo");
      }
    });
    this.mensaje = "";
  }

  getMessageCtrl(){
    return this.chatForm.controls["messageCtrl"];
  }
}
