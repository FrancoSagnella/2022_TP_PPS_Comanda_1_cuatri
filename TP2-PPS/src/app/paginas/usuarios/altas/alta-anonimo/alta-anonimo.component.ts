import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import { Vibration } from '@ionic-native/vibration/ngx';
import { NavController, ToastController } from '@ionic/angular';
//import { ToastrService } from 'ngx-toastr';
import { Anonimo } from 'src/app/clases/anonimo';
import { AuthService } from 'src/app/services/auth.service';
import { FotoService } from 'src/app/services/foto.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
@Component({
  selector: 'app-alta-anonimo',
  templateUrl: './alta-anonimo.component.html',
  styleUrls: ['./alta-anonimo.component.scss'],
})
export class AltaAnonimoComponent implements OnInit {

  form: FormGroup;
  private spinner = false;

  validationUserMessage = {
    name: [
      { type: "required", message: "Por favor, ingrese nombre" },
      { type: "minlength", message: "El nombre debe tener 2 caractéres o más" },
      { type: "maxlength", message: "El nombre no puede tener más de 30 caractéres" },
      { type: "pattern", message: "El nombre ingresado es incorrecto, inténtelo de nuevo!" },
    ],
    img: [
      { type: "required", message: "Por favor, ingrese foto de perfil" },
    ]
  }


  constructor(
    private formbuider: FormBuilder,
    private authService: AuthService,
    private router: Router,
   // private vibration: Vibration,
    private toastr: ToastController,
    private fs: FirestoreService,
    private userService: UsuariosService,
    private fotoService: FotoService,
    public navCtrl: NavController
  ) { }



  navigateBack(){
    this.navCtrl.back();
  }

  ngOnInit() { this.validateForm(); }

  validateForm() {
    this.form = this.formbuider.group({
      name: new FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ñ]+$'), Validators.maxLength(30), Validators.minLength(2)])),
      img: new FormControl('', Validators.compose([Validators.required])),
      profile: new FormControl('ANONIMO'),
    })
  }

  get name() { return this.form.get('name').value; }
  set name(data: string) { this.form.controls['name'].setValue(data); }

  get img() { return this.form.get('img').value; }
  set img(data: any) { this.form.controls['img'].setValue(data); }

  profile: string = '';
  email: string = '';
  password: string = "123456";

  async takePic() {
    const image = await this.fotoService.addNewToGallery();
    if (image) { this.img = image; }
  }

  onRegister() {
    this.spinner = true;
    this.email = this.name + '@anonymous.com';
    const user = this.authService.register(this.email, this.password);
    if (user) {
      const userAux = this.getDataUser();
      this.fs.saveImage(this.img, 'users', new Date().getTime() + '')
        .then(async url => {
          userAux.img = url;
          await this.userService.alta(userAux);
          localStorage.setItem('user', JSON.stringify(userAux));

          // await this.authService.login(this.email, this.password);

          await this.onLoginAnonymous(this.email, this.password);
          // this.vibration.vibrate([500]);
          // this.toastr.success('Datos guardados con éxito!', 'Registro de Usuario');
          this.presentToast('Datos guardados con exito', 2000, 'success', 'Alta exitosa');
          this.spinner = false;
          this.router.navigateByUrl('usuarios/login');
          this.resetForm();

          // this.redirectTo('/home');
        });
    }
    else {
      //this.vibration.vibrate([500, 500, 500]);
      this.presentToast('Datos incorrectos', 2000, 'danger', 'registro incorrecto');
      // this.toastr.error("Datos ingresados incorrectos", 'Registro de Usuario');
     this.spinner = false;
    }
  }

  getDataUser() {
    let user: Anonimo = null;

    user = {
      id: '',
      nombre: this.name,
      apellido: '',
      dni: 0,
      img: this.img,
      estado: 'ACEPTADO',
      correo: this.name+'@anonymous.com',
      perfil: 'ANONIMO',
      fechaCreacion: new Date().getTime()
    };

    return user;
  }

  async onLoginAnonymous(email: string, pass: string) {
    try {
      await this.authService.login(email, pass);
    //  this.vibration.vibrate([500]);
      //this.toastr.success('Ingreso con Exito', 'Iniciar Sesión');
      this.redirectTo('/home');
    }
    catch (error) {
    //  this.vibration.vibrate([500, 500, 500]);
    //  this.toastr.error('Error en registro anonymous', 'Iniciar Sesión');

      // if (error == 911) { this.toastr.error('Aún no fue aceptado por Administración, sea paciente', 'Iniciar Sesión'); }
      // else { this.toastr.error('Email/Contraseña Incorrecto', 'Iniciar Sesión'); }
    }
  }

  redirectTo(path: string) {
    this.router.navigate([path]);
  }

  resetForm() { this.ngOnInit(); }

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
