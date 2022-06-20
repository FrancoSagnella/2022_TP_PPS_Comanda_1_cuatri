import { Injectable } from '@angular/core';
import { Usuario } from '../clases/usuario';
import emailjs from 'emailjs-com';
import { init } from 'emailjs-com';
init('udm3AsdPfIEtHfVFL');

@Injectable({
  providedIn: 'root'
})
export class MailService {

  private serviceID = 'service_bpbcr2b';
  private templateID = 'template_q7p2575';

  constructor() { }

  notificationWelcome(model: Usuario) {
    let template = {
        from_name: "La Comanda",
        to: model.correo,
        client_name: model.nombre,
        message: "Si recibió este correo electrónico significa que se ha registrado correctamente en La Comanda muchas gracias!",
    }

    try { emailjs.send(this.serviceID, this.templateID, template) }
    catch (error) { console.log("Error al enviar el email.", error); }
}

notificationInabled(model: Usuario) {
    let template = {
        from_name: "La Comanda",
        to: model.correo,
        client_name: model.nombre,
        message: "Para acceder a la aplicacion debe aguardar a que su cuenta sea activada",
    }

    try { emailjs.send(this.serviceID, this.templateID, template) }
    catch (error) { console.log("Error al enviar el email.", error); }
}

notificationStatus(model: Usuario) {
    let template = {
        from_name: "La Comanda",
        to: model.correo,
        client_name: model.nombre,
        message: "Usted se encuentra actualmente en estado " + model.estado + " para ingresar al local.",
    }

    try { emailjs.send(this.serviceID, this.templateID, template) }
    catch (error) { console.log("Error al enviar el email.", error); }
}
}
