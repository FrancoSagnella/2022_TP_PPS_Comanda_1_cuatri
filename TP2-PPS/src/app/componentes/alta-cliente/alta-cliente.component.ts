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
    private camera:Camera,private qr : BarcodeScanner,private storage: AngularFireStorage,public auth:AuthService
    ) { }
  cliente:Cliente={id:'',correo:'',clave:'',nombre:'',apellido:'',foto:'',habilitado:false,dni:''};
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
  enviar(){
    console.info("formulario",this.grupoDeControles);
  //alert(this.cliente.correo)

      


     //alert(this.producto.descripcion)
    this.cliente.nombre = this.grupoDeControles.get('nombre')?.value;
    this.cliente.apellido = this.grupoDeControles.get('apellido')?.value;
    this.cliente.correo = this.grupoDeControles.get('correo')?.value;
    this.cliente.dni = this.grupoDeControles.get('dni')?.value;
    this.cliente.clave = this.grupoDeControles.get('clave')?.value;
    this.cliente.foto = this.grupoDeControles.get('foto')?.value;
    /*this.producto.comestible = this.grupoDeControles.get('comestible')?.value;
    this.producto.pais = this.grupoDeControles.get('pais')?.value;*/
     //this.repartidor.id=this.afs.createId(); 
     this.auth.register(this.cliente.correo, this.cliente.clave).then(response => {
this.cliente.id = response.user.uid;
      let email = response.user.email;
    this.cliente.id= this.cliente.id
    
    const filePath = `/cliente/${email}/fotoCliente.jpg`;


					this.subirImagen(filePath, this.cliente.foto).then(url => {
						this.fotoCargada = url;
						this.cliente.foto = this.fotoCargada;
						//this.usuarioSvc.AgregarUsuario(JSON.parse(JSON.stringify(this.socio)));
					});
          
          
          /*let pathRef = `fotos/`+this.cliente.nombre;
          const fileRef = this.storage.ref(pathRef);
          const task = this.storage.upload(pathRef, this.foto);  
          task.snapshotChanges().toPromise().then(() => {
            fileRef.getDownloadURL().toPromise().then(response => {
      
              this.cliente.foto = response;  
            });
          });*/
					this.grupoDeControles.reset();
    
   
    })
    
    
    
    
    this.firestore.actualizar('cliente',this.cliente.id,this.cliente).then(()=>{
      //this.route.navigate(['bienvenido']);
    }
    )
  
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
  tomarFotografia() {
		const options: CameraOptions = {
			quality: 100,
			targetHeight: 600,
			targetWidth: 600,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			correctOrientation: true
		}
		this.camera.getPicture(options).then((imageData) => {
			var base64Str = 'data:image/jpeg;base64,' + imageData;
			//	this.grupoDeControles.controls.foto.setValue(base64Str);
        this.grupoDeControles.get('foto')?.setValue(base64Str);
 
		});
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

  public subirImagen(ruta: string, data: any) {
		return this.storage.ref(ruta).putString(data, 'data_url').then(data => {
			return data.ref.getDownloadURL().then(x => x);
		});
	}

  onSelecFoto(e:any){
    if(e.target.files && e.target.files[0])
    {
      this.foto = e.target.files[0];
      
    }
    this.grupoDeControles.get('foto')?.setValue(this.foto);
  }
  

}
