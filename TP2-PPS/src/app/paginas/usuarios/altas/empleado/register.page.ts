import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

import { UserService } from 'src/app/services/user.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { CameraService } from 'src/app/services/camera.service';
import { Empleado } from 'src/app/clases/empleado';
import { QrService } from 'src/app/services/qr.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { NavController } from '@ionic/angular';

declare let window: any;

@Component({
  selector: 'app-register-empleado',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {
  form: FormGroup;

  private options = {
    prompt: "Escaneá el DNI",
    formats: 'PDF_417, QR_CODE',
    showTorchButton: true,
    resultDisplayDuration: 2,
  };
  
  listEmployees = [
    { kynd: 'METRE' },
    { kynd: 'MOZO' },
    { kynd: 'COCINERO' },
    { kynd: 'BARTENDER' },
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

  constructor(
    private formbuider: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public toastr: ToastrService,
    private userService: UserService,
    private fs: FirestoreService,
    private cameraService: CameraService,
    private qrService: QrService,
    
    private qrDni: BarcodeScanner,
    public navCtrl: NavController 
  ) { }
 
 
  navigateBack(){
    this.navCtrl.back();
  }

  ngOnInit() { this.validateForm(); }

  validateForm() {
    this.form = this.formbuider.group({
      name: new FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ñ]+$'), Validators.maxLength(30), Validators.minLength(2)])),
      surname: new FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ñ]+$'), Validators.maxLength(30), Validators.minLength(2)])),
      dni: new FormControl('', Validators.compose([Validators.required, Validators.min(11111111), Validators.max(99999999)])),
      cuil: new FormControl('', Validators.compose([Validators.required, Validators.min(11111111111), Validators.max(99999999999)])),
      img: new FormControl('', Validators.compose([Validators.required])),
      profile: new FormControl('', Validators.compose([Validators.required])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.maxLength(35)])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])),
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
      this.toastr.error("Error al escanear el DNI");
    });

  }

  inputSetQr = {
    name: '',
    surname: '',
    dni: '',
  };

  // async scannQR() {
  //   let data: any = await this.qrService.scannDNI();

  //   if (data) {
  //     this.surname = data.name;
  //     this.name = data.surname;
  //     this.dni = data.dni;
  //   }
  //   else { this.toastr.error("Error al escanear el DNI", "QR"); }
  // }

  async takePic() {
    const image = await this.cameraService.addNewToGallery();
    if (image) { this.img = image; }
  }

  onRegister() {
    const auth = this.authService.register(this.email, this.password);
    if (auth) {
      const user = this.getDataUser();
      this.fs.saveImage(this.img, 'users', new Date().getTime() + '')
        .then(async url => {
          user.img = url;

          await this.userService.createOne(user);
        
          this.toastr.success('Datos guardados con éxito!', 'Registro de Usuario');
          this.resetForm();
        });
    }
    else {
    
      this.toastr.error("Datos ingresados incorrectos", 'Registro de Usuario');
    }
  }

  getDataUser() {
    let user: Empleado = null;

    if (this.profile == 'METRE') {
      user = {
        id: '',
        nombre: this.name,
        apellido: this.surname,
        dni: this.dni,
        cuil: this.cuil,
        img: this.img,
        estado: 'ACEPTADO',
        correo: this.email,
        rol: 'METRE',
        perfil: 'EMPLEADO',
        fecha_creacion: new Date().getTime()
      };
    }
    else if (this.profile == 'MOZO') {
      user = {
        id: '',
        nombre: this.name,
        apellido: this.surname,
        dni: this.dni,
        cuil: this.cuil,
        img: this.img,
        estado: 'PENDIENTE',
        correo: this.email,
        rol: 'MOZO',
        perfil: 'EMPLEADO',
        fecha_creacion: new Date().getTime()
      };
    }
    else if (this.profile == 'COCINERO') {
      user = {
        id: '',
        nombre: this.name,
        apellido: this.surname,
        dni: this.dni,
        cuil: this.cuil,
        img: this.img,
        estado: 'PENDIENTE',
        correo: this.email,
        rol: 'COCINERO',
        perfil: 'EMPLEADO',
        fecha_creacion: new Date().getTime()
      };
    }
    else if (this.profile == 'BARTENDER') {
      user = {
        id: '',
        nombre: this.name,
        apellido: this.surname,
        dni: this.dni,
        cuil: this.cuil,
        img: this.img,
        estado: 'PENDIENTE',
        correo: this.email,
        rol: 'BARTENDER',
        perfil: 'EMPLEADO',
        fecha_creacion: new Date().getTime()
      };
    }
    return user;
  }

  redirectTo(path: string) {
    this.router.navigate([path]);
  }

  resetForm() { this.ngOnInit(); }
}