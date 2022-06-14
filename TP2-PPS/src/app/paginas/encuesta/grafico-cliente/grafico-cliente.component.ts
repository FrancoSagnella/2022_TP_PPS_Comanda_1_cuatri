import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-grafico-cliente',
  templateUrl: './grafico-cliente.component.html',
  styleUrls: ['./grafico-cliente.component.scss'],
})
export class GraficoClienteComponent implements OnInit {

  constructor(
    private router: Router,
    private db:FirestoreService,
    public navCtrl: NavController
    ) { }

  ngOnInit() {
    console.log(this.db.getAllEncuesta());
  }

  navigateBack(){
    this.navCtrl.back();
  }

  redirectTo(path: string) {
    this.router.navigate([path]);
  }

}
