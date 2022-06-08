import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Mesa } from 'src/app/clases/mesa';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FotoService } from 'src/app/services/foto.service';
import { MesaService } from 'src/app/services/mesa.service';
import { ToastService } from 'src/app/services/toast.service';
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
  selector: 'app-alta',
  templateUrl: './alta.component.html',
  styleUrls: ['./alta.component.scss'],
})
export class AltaComponent implements OnInit {

  form: FormGroup;
  resultadoError: boolean = null;
  img: any;

  constructor(
    private formbuider: FormBuilder,
    private mesaSrv: MesaService,
    private cameraService: FotoService,
    private fs: FirestoreService,
    private vibration: Vibration,
    private toastr: ToastService,
    // private qrService: QrService,
    private router: Router,
    public navCtrl: NavController
  ) { }



  navigateBack() {
    this.navCtrl.back();
  }

  ngOnInit() {
    this.img = '';
    this.form = this.formbuider.group({
      'numero': ['', [Validators.required]],
      'cantidad': ['', [Validators.required]],
      'tipo': ['', [Validators.required]]
    });
  }

  async takePic() {
    const image = await this.cameraService.addNewToGallery();
    if (image) { this.img = image; }
  }


  crearMesa() {
    let model = this.getDataModel();
    // let flag;

    try {
      const a = this.mesaSrv.getByNumber(model.numero).subscribe(data => {

        if (!data) {
          this.fs.saveImage(this.img, 'mesas', new Date().getTime() + '')
            .then(url => {
              model.img = url;

              this.mesaSrv.createOne(model);
              // this.vibration.vibrate([500]);

              // let audio = new Audio('./assets/sounds/noti.mp3');
              // audio.play();

              this.toastr.presentToast('Datos guardados con exito', 2000, 'success', 'Alta exitosa');
              this.resetForm();
            });
        }
        else {
          // this.toastr.error('Número de mesa ya existente, por favor ingrese otro número', 'Alta de Mesa');
          this.toastr.presentToast('Ese numero de mesa ya existe', 2000, 'danger', 'Alta denegada');
          this.vibration.vibrate([500]);
        }
        a.unsubscribe();
      })

    }
    catch (error) {
      this.toastr.presentToast('Datos incorrectos', 2000, 'danger', 'Alta denegada');
      this.vibration.vibrate([500]);
    }
  }

  private getDataModel() {
    let model: Mesa = {
      id: '',
      img: '',
      estado: 'DISPONIBLE',
      tipo: this.form.get('tipo').value,
      numero: this.form.get('numero').value,
      cantidad: this.form.get('cantidad').value,
    };

    return model;
  }



  resetForm() { this.ngOnInit(); }

  redirectTo(path: string) {
    this.router.navigate([path]);
  }

}
