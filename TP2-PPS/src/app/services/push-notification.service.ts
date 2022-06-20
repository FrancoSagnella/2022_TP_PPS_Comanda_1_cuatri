import { Injectable } from '@angular/core';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';
import { LocalNotifications } from '@capacitor/local-notifications';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  public user;
  constructor(
    private platform: Platform,
    private firestore: Firestore,
    private http: HttpClient,
    private angularFirestore:AngularFirestore,
    private usuarios:UsuariosService
  ) {
    // const aux = doc(firestore, 'personas/4hjcn6LXY1qVfxBDYub3');
    // docData(aux).subscribe((user) => (this.user = user));
  }

  async inicializar(): Promise<void> {
    this.addListeners();
    // Verificamos que este en un dispositivo y no en una PC y tambien que el usuario no tegna seteado el token
    if (this.platform.is('capacitor') && typeof this.user.token === 'undefined') {
      const result = await PushNotifications.requestPermissions();
      if (result.receive === 'granted') {
        await PushNotifications.register();
      }
    }
  }

  getUser(id): void {
    // const aux = doc(this.firestore, 'usuarios/'+id);
    // docData(aux, { idField: 'id' }).subscribe(async (user) => {
    //   console.log(user);
    //   this.user = user;
    //   this.inicializar();
    // });
      this.user = id;
      this.inicializar();
  }

  sendPushNotification(req): Observable<any> {
    return this.http.post<Observable<any>>(environment.fcmUrl, req, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `key=${environment.fcmServerKey}`,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      },
    });
  }

  private async addListeners(): Promise<void> {
    //Ocurre cuando el registro de las push notifications finaliza sin errores
    await PushNotifications.addListener(
      'registration',
      async (token: Token) => {
        //Acá deberiamos asociar el token a nuestro usario en nuestra bd
        console.log('Registration token: ', token.value);
        this.user.token = token.value;
        const aux = doc(this.firestore, `usuarios/${this.user.id}`);
        await updateDoc(aux, {
          token: token.value,
        });
      }
    );

    //Ocurre cuando el registro de las push notifications finaliza con errores
    await PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error: ', err.error);
    });

    //Ocurre cuando el dispositivo recive una notificacion push
    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        //Este evento solo se activa cuando tenemos la app en primer plano
        console.log('Push notification received: ', notification);
        console.log('data: ', notification.data);
        //Esto se hace en el caso de que querramos que nos aparezca la notificacion en la task bar del celular ya que por
        //defecto las push en primer plano no lo hacen, de no ser necesario esto se puede sacar.
        LocalNotifications.schedule({
          notifications: [
            {
              title: notification.title || '',
              body: notification.body || '',
              id: new Date().getMilliseconds(),
              extra: {
                data: notification.data,
              },
            },
          ],
        });
      }
    );

    //Ocurre cuando se realiza una accion sobre la notificacion push
    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        //Este evento solo se activa cuando tenemos la app en segundo plano y presionamos sobre la notificacion
        console.log(
          'Push notification action performed',
          notification.actionId,
          notification.notification
        );
      }
    );

    //Ocurre cuando se realiza una accion sobre la notificacion local
    await LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (notificationAction) => {
        console.log('action local notification', notificationAction);
      }
    );
  }

  enviarNotificacionUsuarios(perfil:string, titulo:string, body:string, rol:any = false)
  {
    let usuariosTokens: any[] = [];
    let sub:any;
    if(rol){
      sub = this.usuarios.getByRol(perfil);
    }
    else{
      sub = this.usuarios.getByPerfil(perfil);
    }

    let sub2 = sub.subscribe((data) => {
      // console.log(data);
      data.forEach(element => {
        usuariosTokens.push(element.token);
      });
      // console.log('usuariosTokens', usuariosTokens);
      let push = this.sendPushNotification({
        registration_ids: usuariosTokens,
        notification:{
          title: titulo,
          body: body
        }
      }).subscribe((data) => {
        console.log(data);
        push.unsubscribe();
      });
      sub2.unsubscribe();
    })
  }
}
