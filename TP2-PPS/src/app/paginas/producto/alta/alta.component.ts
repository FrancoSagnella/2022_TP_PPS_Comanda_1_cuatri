import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from 'src/app/clases/producto';
//import { CameraService } from 'src/app/services/camera.service';
import { ProductoService } from 'src/app/services/producto.service';
import {  FirestoreService } from 'src/app/services/firestore.service';
import { Photo } from '@capacitor/camera';
import { Router } from '@angular/router';
// import { Vibration } from '@ionic-native/vibration/ngx';
import { ToastrService } from 'ngx-toastr';
import { NavController } from '@ionic/angular';
import { FotoService } from 'src/app/services/foto.service';
@Component({
  selector: 'app-alta',
  templateUrl: './alta.component.html',
  styleUrls: ['./alta.component.scss'],
})
export class AltaComponent implements OnInit {

  form: FormGroup;
  resultadoError: boolean = null;
  nuevoProducto: Producto;
  i_NroImagen: number = 0;
  errorImagen: boolean;

  constructor(private router: Router,
    private formbuider: FormBuilder,
    private prodSrv: ProductoService,
    private cameraService: FotoService,
    private fs: FirestoreService,
    //private vibration: Vibration,
    private toastr: ToastrService,
    public navCtrl: NavController) { }

    navigateBack(){
      this.navCtrl.back();
    }
    
    ngOnInit() {
      this.nuevoProducto = new Producto();
      this.nuevoProducto.img_src = new Array();
      this.form = this.formbuider.group({
        nombreProducto: ['', [Validators.required]],
        descripcionProducto: ['', [Validators.required]],
        tiempo: ['', [Validators.required]],
        precio: ['', [Validators.required]],
        tipo: ['', [Validators.required]]
      });
    }
  
    private createModel() {
      let a: Producto = {
        id: '',
        nombreProducto: this.form.get('nombreProducto').value,
        descripcion: this.form.get('descripcionProducto').value,
        tiempo: this.form.get('tiempo').value,
        precio: this.form.get('precio').value,
        tipo: this.form.get('tipo').value,
        img_src: this.nuevoProducto.img_src
      };
  
      return a;
    }
  
    crearProducto() {
      const a: Producto = this.createModel();
  
    /*  this.prodSrv.guardarNuevoProducto(this.nuevoProducto).then((res) => {
        this.vibration.vibrate([500]);
        this.toastr.success('Datos guardados con éxito!', 'Registro de producto');
        this.resetForm();*/
      this.prodSrv.createOne(a).then((res) => {
        console.log(res);
        let audio = new Audio('./assets/sounds/noti.mp3');
                audio.play();
        this.resultadoError = false;
      }).catch((err) => {
        this.resultadoError = true;
      });
    }
  
    resetForm() { this.ngOnInit(); }
    
    tomarFotoProducto() {
      if (this.i_NroImagen < 3) {
        this.addPhotoToGallery();
      }
    }
  
    async addPhotoToGallery() {
      const photo = await this.cameraService.addNewToGallery();
      this.uploadPhoto(photo).then().catch((err) => {
        console.log("Error addPhotoToGallery", err);
      });
    }
  
    private async uploadPhoto(cameraPhoto: Photo) {
      const response = await fetch(cameraPhoto.webPath!);
      const blob = await response.blob();
      const filePath = this.getFilePath();
  
      const uploadTask = this.fs.saveFile(blob, filePath);
  
      console.log("nro actual de fotos cargadas: " + this.i_NroImagen);
      uploadTask.then(async res => {
        const downloadURL = await res.ref.getDownloadURL();
        if (downloadURL.length > 0) {
          console.log("URL  CORRECTO- i_IMG++");
          this.nuevoProducto.img_src.push(downloadURL);
  
          this.i_NroImagen++;
          console.log("Cntidad fotos cargadas: " + this.i_NroImagen + "\n URL:" + this.nuevoProducto.img_src);
          console.log(this.nuevoProducto.img_src);
        } else {
          console.log("IMAGEN NO CORRECTA . NO SE CONTABILIZA " + this.i_NroImagen);
        }
        this.validarCantidadFotos();
      })
        .catch((err) => {
          console.log("Error al subbir la imagen: ", err);
        });
    }
  
    getFilePath() {
      return 'products/' + new Date().getTime();
    }
  
    private validarCantidadFotos(): boolean {
      this.errorImagen = (this.i_NroImagen == 3) ? false : true;
      return this.errorImagen;
    }
  
    redirectTo(path: string) {
      this.router.navigate([path]);
    }

}
