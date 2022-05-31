import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})
export class SplashComponent {
  splash=true;
  constructor(private platform:Platform) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(()=>{
      setTimeout(()=>{
        SplashScreen.hide();
        if(this.splash){
          setTimeout(()=>{
            this.splash=false;
          }, 4600);
        }
      },3000);
    });
  }


}
