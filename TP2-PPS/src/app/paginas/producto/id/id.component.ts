import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ProductoService } from 'src/app/services/producto.service';


@Component({
  selector: 'app-id',
  templateUrl: './id.component.html',
  styleUrls: ['./id.component.scss'],
})
export class IdComponent implements OnInit {

  product$: Observable<any>;

  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  };

  constructor(
    private route: ActivatedRoute,
    private prodService: ProductoService,
  public navCtrl: NavController 

  ) { }

  ngOnInit() {
    this.getProduct();
  }

  navigateBack(){
    this.navCtrl.back();
  }
  getProduct() {
    const id = this.route.snapshot.paramMap.get('id');
    this.product$ = this.prodService.getById(id);
  }
}
