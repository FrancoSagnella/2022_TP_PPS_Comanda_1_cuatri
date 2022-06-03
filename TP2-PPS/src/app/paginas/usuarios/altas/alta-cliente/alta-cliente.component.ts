import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Router } from '@angular/router';
import { BarcodeScanner, BarcodeScannerOptions } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { Camera,CameraOptions  } from '@awesome-cordova-plugins/camera/ngx';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/clases/cliente';
import { AuthService } from 'src/app/services/auth.service';
import { FotoService } from 'src/app/services/foto.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.component.html',
  styleUrls: ['./alta-cliente.component.scss'],
})
export class AltaClienteComponent implements OnInit {
  public grupoDeControles!:FormGroup
  private spinner = false;
	fotoCargada: any;
 foto:any;

 validationUserMessage = {
  nombre: [
    { type: "required", message: "Por favor, ingrese nombre" },
    { type: "minlength", message: "El nombre debe tener 2 caractéres o más" },
    { type: "maxlength", message: "El nombre no puede tener más de 30 caractéres" },
    { type: "pattern", message: "El nombre ingresado es incorrecto, inténtelo de nuevo!" },
  ],
  apellido: [
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
  img: [
    { type: "required", message: "Por favor, ingrese foto de perfil" },
  ],
  correo: [
    { type: "required", message: "Por favor, ingrese correo" },
    { type: "maxlength", message: "El correo no puede tener más de 30 caractéres" },
    { type: "pattern", message: "El correo ingresado es incorrecto, inténtelo de nuevo!" }
  ],
  clave: [
    { type: "required", message: "Por favor, ingrese contraseña" },
    { type: "minlength", message: "La contraseña debe tener 6 caractéres o más" },
    { type: "maxlength", message: "La contraseña no puede tener más de 15 caractéres" },
  ]
}
  constructor(private fb:FormBuilder, private afs: AngularFirestore,private firestore:FirestoreService,private route:Router,
    private camera:Camera,private qr : BarcodeScanner,private storage: AngularFireStorage,public auth:AuthService,
    private fotoService:FotoService, private usuariosService:UsuariosService,private toastr:ToastController
    ) { }
  cliente:Cliente={id:'',correo:'',nombre:'',apellido:'',img:'',estado:'PENDIENTE',dni:0,fechaCreacion:0,perfil:'CLIENTE'};

	public barcodeOptions: BarcodeScannerOptions = {
		prompt: "Colocar el codigo de barras en la linea de escaneo",
		formats: "QR_CODE,PDF_417",
		orientation: "landscape"
	};

  ngOnInit() {

    this.grupoDeControles=this.fb.group({
      //'descripcion':['',[Validators.required,this.validadorDeEspacios]],
      //'codigo':['',[Validators.required,Validators.min(100),Validators.max(10000)]],
      'nombre':['',Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ñ]+$'), Validators.maxLength(30), Validators.minLength(2)])],
      'apellido':['',Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ñ]+$'), Validators.maxLength(30), Validators.minLength(2)])],
      'correo':['',Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.maxLength(35)])],
      'dni':['',Validators.compose([Validators.required, Validators.min(11111111), Validators.max(99999999)])],
      'clave':['',Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
      'foto':['',Validators.compose([Validators.required])],
     // 'comestible':['',[Validators.required]],
      //'localidad':['',Validators.required],
      //'pais':['',Validators.required],

    });

  }


  get img() { return this.grupoDeControles.get('foto').value; }
  set img(data: any) { this.grupoDeControles.controls['foto'].setValue(data); }

  enviar(){
    this.spinner = true;
    console.info("formulario",this.grupoDeControles);
    //alert(this.cliente.correo)
    //alert(this.producto.descripcion)
    this.cliente.nombre = this.grupoDeControles.get('nombre')?.value;
    this.cliente.apellido = this.grupoDeControles.get('apellido')?.value;
    this.cliente.correo = this.grupoDeControles.get('correo')?.value;
    this.cliente.dni = this.grupoDeControles.get('dni')?.value;
    // this.cliente.clave = this.grupoDeControles.get('clave')?.value;
    this.cliente.img = this.grupoDeControles.get('foto')?.value;
    this.cliente.fechaCreacion = new Date().getTime();

    /*this.producto.comestible = this.grupoDeControles.get('comestible')?.value;
    this.producto.pais = this.grupoDeControles.get('pais')?.value;*/
    //this.repartidor.id=this.afs.createId();
    const auth = this.auth.register(this.cliente.correo, this.grupoDeControles.get('clave')?.value).then(response => {

    if (auth) {
      this.firestore.saveImage(this.img, 'users', new Date().getTime() + '')
        .then(async url => {
          this.cliente.img = url;

          await this.usuariosService.alta(this.cliente);
          // this.vibration.vibrate([500]);
          // this.toastr.success('Datos guardados con éxito!', 'Registro de Usuario');
          this.presentToast('Datos guardados con exito', 2000, 'success', 'Alta exitosa');
          this.spinner = false;
          this.route.navigateByUrl('usuarios/login');
          this.resetForm();
        });
    }
    else {
      // this.vibration.vibrate([500, 500, 500]);
      // this.toastr.error("Datos ingresados incorrectos", 'Registro de Usuario');
      this.spinner = false;
      this.presentToast('Datos incorrectos', 2000, 'danger', 'registro incorrecto');
    }

    })

  }

  navigateBack(){
    // this.navCtrl.back();
  }

  resetForm() { this.ngOnInit(); }

  async takePic() {
    const image = await this.fotoService.addNewToGallery();
    if (image) { this.img = image; }
  }

  private validadorDeEspacios(control: AbstractControl):null|object{
    let nombre:string=control.value;
    let espacios=nombre.includes(' ');
    if(espacios==true){
      return {
        validadorDeEspacios:true
      }
    }
    else{
      return null;
    }
    return null;
  }

  escanearDni() {
		let auxDni;
		let scanSub = this.qr.scan(this.barcodeOptions).then(dataString => {
			let x: any = [];
			x = dataString.text.split('@');
			if (x.length == 8 || x.length == 9) {
        this.grupoDeControles.get('apellido')?.setValue(x[1]);
        this.grupoDeControles.get('nombre')?.setValue(x[2]);
        this.grupoDeControles.get('dni')?.setValue(x[4]);

				/*this.form.controls.apellido.setValue(x[1]);
				this.form.controls.nombre.setValue(x[2]);
				this.form.controls.dni.setValue(x[4]);*/
			} else {
        this.grupoDeControles.get('apellido')?.setValue(x[5]);
        this.grupoDeControles.get('nombre')?.setValue(x[4]);
        this.grupoDeControles.get('dni')?.setValue(x[1]);
				/*this.form.controls.dni.setValue(x[1]);
				this.form.controls.apellido.setValue(x[4]);
				this.form.controls.nombre.setValue(x[5]);*/
			}
		});
	}
  redirectTo(path: string) {
    this.route.navigate([path]);
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
