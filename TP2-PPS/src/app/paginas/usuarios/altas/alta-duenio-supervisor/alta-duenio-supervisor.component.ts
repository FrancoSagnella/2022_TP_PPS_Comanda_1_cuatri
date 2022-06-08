import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { Duenio } from 'src/app/clases/duenio';
import { Supervisor } from 'src/app/clases/supervisor';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FotoService } from 'src/app/services/foto.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { ToastController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast.service';
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
  selector: 'app-alta-duenio-supervisor',
  templateUrl: './alta-duenio-supervisor.component.html',
  styleUrls: ['./alta-duenio-supervisor.component.scss'],
})
export class AltaDuenioSupervisorComponent implements OnInit {
  form: FormGroup;

  private options = {
    prompt: "Escaneá el DNI",
    formats: 'PDF_417, QR_CODE',
    showTorchButton: true,
    resultDisplayDuration: 2,
  };

  listEmployees = [
    { kynd: 'DUENIO' },
    { kynd: 'SUPERVISOR' },
  ]

  validationUserMessage = {
    name: [
      { type: "required", message: "Por favor, ingrese nombre" },
      { type: "minlength", message: "El nombre debe tener 2 caractéres o más" },
      { type: "maxlength", message: "El nombre no puede tener más de 30 caractéres" },
      { type: "pattern", message: "El nombre ingresado es incorrecto, inténtelo de nuevo!" },
    ],
    surname: [
      { type: "required", message: "Por favor, ingrese apellido" },
      { type: "minlength", message: "El apellido debe tener 2 caractéres o más" },
      { type: "maxlength", message: "El apellido no puede tener más de 30 caractéres" },
      { type: "pattern", message: "El apellido ingresado es incorrecto, inténtelo de nuevo!" },
    ],
    dni: [
      { type: "required", message: "Por favor, ingrese DNI" },
      { type: "max", message: "El DNI debe tener 8 dígitos" },
      { type: "min", message: "El DNI debe tener 8 dígitos" }
    ],
    cuil: [
      { type: "required", message: "Por favor, ingrese CUIL" },
      { type: "max", message: "El CUIL debe tener 11 dígitos" },
      { type: "min", message: "El CUIL debe tener 11 dígitos" }
    ],
    img: [
      { type: "required", message: "Por favor, ingrese foto de perfil" },
    ],
    profile: [
      { type: "required", message: "Por favor, seleccione el tipo de empleado" },
    ],
    email: [
      { type: "required", message: "Por favor, ingrese correo" },
      { type: "maxlength", message: "El correo no puede tener más de 30 caractéres" },
      { type: "pattern", message: "El correo ingresado es incorrecto, inténtelo de nuevo!" }
    ],
    password: [
      { type: "required", message: "Por favor, ingrese contraseña" },
      { type: "minlength", message: "La contraseña debe tener 6 caractéres o más" },
      { type: "maxlength", message: "La contraseña no puede tener más de 15 caractéres" },
    ]
  }

  private spinner = false;

  constructor(
    private router: Router,
    private vibration: Vibration,
    private toastr:ToastService,
    private formbuider: FormBuilder,
    private authService: AuthService,
    private usuariosService: UsuariosService,
    private firestore: FirestoreService,
    private fotoService: FotoService,
    // private qrService: QrService,
    private qrDni: BarcodeScanner,
  ) { }



  navigateBack(){
    // this.navCtrl.back();
  }
  ngOnInit() { this.validateForm(); }

  validateForm() {
    this.form = this.formbuider.group({
      'name': ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ñ]+$'), Validators.maxLength(30), Validators.minLength(2)])],
      'surname': ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ñ]+$'), Validators.maxLength(30), Validators.minLength(2)])],
      'dni': ['', Validators.compose([Validators.required, Validators.min(11111111), Validators.max(99999999)])],
      'cuil': ['', Validators.compose([Validators.required, Validators.min(11111111111), Validators.max(99999999999)])],
      'img': ['', Validators.compose([Validators.required])],
      'profile': ['', Validators.compose([Validators.required])],
      'email': ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.maxLength(35)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
    })
  }

  get name() { return this.form.get('name').value; }
  set name(data: string) { this.form.controls['name'].setValue(data); }

  get surname() { return this.form.get('surname').value; }
  set surname(data: string) { this.form.controls['surname'].setValue(data); }

  get dni() { return this.form.get('dni').value; }
  set dni(data: number) { this.form.controls['dni'].setValue(data); }

  get cuil() { return this.form.get('cuil').value; }
  set cuil(data: number) { this.form.controls['cuil'].setValue(data); }

  get img() { return this.form.get('img').value; }
  set img(data: any) { this.form.controls['img'].setValue(data); }

  get profile() { return this.form.get('profile').value; }
  set profile(data: string) { this.form.controls['profile'].setValue(data); }

  get email() { return this.form.get('email').value.toLowerCase(); }
  set email(data: string) { this.form.controls['email'].setValue(data); }

  get password() { return this.form.get('password').value; }
  set password(data: string) { this.form.controls['password'].setValue(data); }

  public flag: boolean = false;

  scannQR() {
    const options = {
      prompt: "Escaneá el DNI",
      formats: 'PDF_417, QR_CODE',
      showTorchButton: true,
      resultDisplayDuration: 2,
    };

    this.qrDni.scan(options).then(barcodeData => {
      const datos = barcodeData.text.split('@');

      this.inputSetQr.surname = datos[1];
      this.inputSetQr.name = datos[2];
      this.inputSetQr.dni = datos[4];

    }).catch(err => {
      console.log(err);
      // this.toastr.error("Error al escanear el DNI");
    });

  }

  inputSetQr = {
    name: '',
    surname: '',
    dni: '',
  };

  async takePic() {
    const image = await this.fotoService.addNewToGallery();
    if (image) { this.img = image; }
  }

  onRegister() {
    this.spinner = true;
    const auth = this.authService.register(this.email, this.password);
    if (auth) {
      const user = this.getDataUser();
      this.firestore.saveImage(this.img, 'users', new Date().getTime() + '')
        .then(async url => {
          user.img = url;

          await this.usuariosService.alta(user);
          // this.vibration.vibrate([500]);
          // this.toastr.success('Datos guardados con éxito!', 'Registro de Usuario');
          this.toastr.presentToast('Datos guardados con exito', 2000, 'success', 'Alta exitosa');
          this.spinner = false;
          this.router.navigateByUrl('usuarios/home');
          this.resetForm();
        });
    }
    else {
      this.vibration.vibrate([500]);
      this.spinner = false;
      this.toastr.presentToast('Datos incorrectos', 2000, 'danger', 'Alta denegada');
      // this.toastr.error("Datos ingresados incorrectos", 'Registro de Usuario');
    }
  }

  getDataUser() {
    let user: Duenio | Supervisor = null;

    if (this.profile == 'DUENIO') {
      user = {
        id: '',
        nombre: this.name,
        apellido: this.surname,
        dni: this.dni,
        cuil: this.cuil,
        img: this.img,
        estado: 'ACEPTADO',
        correo: this.email,
        perfil: 'DUENIO',
        fechaCreacion: new Date().getTime(),
      };
    }
    else {
      user = {
        id: '',
        nombre: this.name,
        apellido: this.surname,
        dni: this.dni,
        cuil: this.cuil,
        img: this.img,
        estado: 'PENDIENTE',
        correo: this.email,
        perfil: 'SUPERVISOR',
        fechaCreacion: new Date().getTime()
      };
    }
    return user;
  }

  redirectTo(path: string) {
    this.router.navigate([path]);
  }

  resetForm() { this.ngOnInit(); }
}
