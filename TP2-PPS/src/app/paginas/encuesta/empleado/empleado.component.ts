import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.scss'],
})
export class EmpleadoComponent implements OnInit {

  constructor(
    private router: Router, public navCtrl:NavController
    ) { }

  ngOnInit() {
  }

  navigateBack(){
    this.navCtrl.back();
  }


  redirectTo(path: string) {
    this.router.navigate([path]);
  }
}
