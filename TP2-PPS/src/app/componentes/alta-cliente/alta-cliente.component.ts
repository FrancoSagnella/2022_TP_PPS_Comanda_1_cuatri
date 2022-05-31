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
@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.component.html',
  styleUrls: ['./alta-cliente.component.scss'],
})
export class AltaClienteComponent implements OnInit {
  public grupoDeControles!:FormGroup
	fotoCargada: any;
 foto:any;
  constructor(private fb:FormBuilder, private afs: AngularFirestore,private firestore:FirestoreService,private route:Router,
    private camera:Camera,private qr : BarcodeScanner,private storage: AngularFireStorage,public auth:AuthService,
    private fotoService:FotoService, private usuariosService:UsuariosService
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
      'nombre':['',[Validators.required]],
      'apellido':['',[Validators.required]],
      'correo':['',[Validators.required]],
      'dni':['',[Validators.required]],
      'clave':['',[Validators.required]],
      'foto':['',[Validators.required]],
     // 'comestible':['',[Validators.required]],
      //'localidad':['',Validators.required],
      //'pais':['',Validators.required],

    });

  }

  get img() { return this.grupoDeControles.get('foto').value; }
  set img(data: any) { this.grupoDeControles.controls['foto'].setValue(data); }

  enviar(){
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
          this.resetForm();
        });
    }
    else {
      // this.vibration.vibrate([500, 500, 500]);
      // this.toastr.error("Datos ingresados incorrectos", 'Registro de Usuario');
    }

    })

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

}
