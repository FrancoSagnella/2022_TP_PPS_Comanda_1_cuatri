import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Vibration } from '@ionic-native/vibration/ngx';
import { ToastController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { MailService } from 'src/app/services/mail.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  users = [
    { email: "duenio@duenio.com", password: "111111", icon: "Dueño" },
    { email: "supervisor@supervisor.com", password: "222222", icon: "Supervisor" },
    { email: "fransagn@gmail.com", password: "111111", icon: "Cliente" },
    // { email: "anonimo@anonimo.com", password: "anonimo", icon: "Anonimo" },
    { email: "metreprueba@gmail.com", password: "111111", icon: "Metre" },
    { email: "mozoprueba@gmail.com", password: "111111", icon: "Mozo" },
    // { email: "cocinero@cocinero.com", password: "555555", icon: "👨‍🍳" },
    // { email: "bartender@bartender.com", password: "666666", icon: "🍻" },
  ]

  validationUserMessage = {
    email: [
      { type: "required", message: "Por favor, ingrese su correo" },
      { type: "pattern", message: "El correo ingresado es incorrecto, inténtelo de nuevo!" }
    ],
    password: [
      { type: "required", message: "Por favor, ingrese su contraseña" },
      { type: "minlength", message: "La contraseña debe tener 6 caractéres o más" }
    ]
  }

  constructor(
    private router: Router,
    private vibration: Vibration,
    private toastr: ToastController,
    private formbuider: FormBuilder,
    private authService: AuthService,
    private userService: UsuariosService,
    private mailService: MailService,
    private pnService: PushNotificationService
  ) { }

  ngOnInit() { this.validateForm(); }


  validateForm() {
    this.form = this.formbuider.group({
      'email': ['', Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      'password': ['', Validators.compose([Validators.required,Validators.minLength(6)])]
    })
  }

  get email() { return this.form.get('email').value; }
  set email(str: string) { this.form.controls['email'].setValue(str); }

  get password() { return this.form.get('password').value; }
  set password(str: string) { this.form.controls['password'].setValue(str); }


  imgUser: string = '';

  selectUser(user) {
    this.email = user.email;
    this.password = user.password;
    this.imgUser = user.icon;
  }

  async onAnonymous() {
      this.redirectTo('usuarios/altaAnonimo');
  }


  async onLogin() {
    const auth = await this.authService.login(this.email, this.password);
    let dataUser;
    this.userService.getByEmail(this.email).subscribe(data => {
      dataUser = data;
    });

    const sub = this.userService.getByEmail(this.email).subscribe(data => {
      console.log(data)
      //alert(auth)
      if (auth && data) {
        if (data.estado == 'ACEPTADO') {
          // this.vibration.vibrate([500]);
          localStorage.setItem('user', JSON.stringify(data));
          // this.toastr.success('Ingreso con éxito', 'Iniciar Sesión');
          this.pnService.getUser(data);
          this.presentToast('Sesión iniciada', 2000, 'success', 'Inicio exitoso');
          this.redirectTo('/home');
        }
        else {
          this.vibration.vibrate([500]);
          // this.toastr.error('Aún no fue habilitado por administración, sea paciente', 'Iniciar Sesión');
          this.presentToast('Su usuario todavía no fue autorizado', 2000, 'danger', 'No se inició sesión');
        }
      }
      else {
        this.vibration.vibrate([500]);
        this.presentToast('Contraseña incorrecta', 2000, 'danger', 'No se inicio sesión');
      }
      sub.unsubscribe();
    });


  }

  redirectTo(path: string) {
    this.router.navigate([path]);
  }


  async presentToast(mensaje: string, duracion: number, color: string, titulo: string, boton?: boolean,
    tituloBotonUno?: string, tituloBotonDos?: string, urlUno?: string, urlDos?: string) {
    let toast;
    if (boton) {
      toast = await this.toastr.create({
        message: mensaje,
        duration: duracion,
        color: color,
        header: titulo,
      });
    }
    else {
      toast = await this.toastr.create({
        message: mensaje,
        duration: duracion,
        color: color,
        header: titulo
      });
    }
    toast.present();
  }
}
