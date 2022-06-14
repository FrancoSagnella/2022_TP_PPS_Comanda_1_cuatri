import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { SplashComponent } from './splash/splash.component';
import { UsuariosModule } from './paginas/usuarios/usuarios.module';
import { HomeComponent } from './paginas/home/home.component';
import { SpinnerComponent } from './paginas/spinner/spinner.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MesaModule } from './paginas/mesa/mesa.module';
import { ScannerModule } from './componentes/scanner/scanner.module';
import { ListComponent } from './paginas/wait/list/list.component';
import { ChatComponent } from './paginas/chat/chat.component';
import { ChatMozoComponent } from './paginas/chat-mozo/chat-mozo.component';
import { IdComponent } from './paginas/game/id/id.component';


@NgModule({
  declarations: [AppComponent,
    SplashComponent,
    HomeComponent,
    SpinnerComponent,
    ListComponent,
    ChatComponent,
    ChatMozoComponent,
    IdComponent
  ],

  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
            FormsModule,
            AngularFireModule.initializeApp(environment.firebaseConfig),
            ReactiveFormsModule,
            AngularFirestoreModule,
            UsuariosModule,
            MesaModule,
            BrowserAnimationsModule,
            ToastrModule.forRoot({
              positionClass: 'toast-top-center',
              preventDuplicates: true,
              progressBar: true
            }),
            ScannerModule],
  providers: [Camera,BarcodeScanner,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],

  bootstrap: [AppComponent],
})
export class AppModule {}
