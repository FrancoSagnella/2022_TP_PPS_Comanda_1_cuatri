import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(public auth:AuthService,private router:Router) {
    // this.auth.register('hola@gmail.com', "123456");
   // this.asdasd();
  }

  async asdasd()
  {
    const user:any = await this.auth.login('hola@gmail.com', "123456");
    console.log(this.auth.currentUser.user);
    console.log(user);
  }
  hola(){
    this.router.navigateByUrl('/altaCliente');

  }
  test(){
    alert("dsfds")
  }
}
