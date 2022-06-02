import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    // private vibration: Vibration,
    // private toastr: ToastrService
  ) { }

  async onLogout() {
    try {
      await this.authService.logout();
      localStorage.removeItem('user');
      // this.vibration.vibrate([500]);

      // let audio = new Audio('./assets/sounds/noti.mp3');
      // audio.play();

      // this.toastr.success('Sesión Cerrada con Exito', 'Salir');
      this.redirectTo('usuarios/login');
    }
    catch (error) {
      // this.vibration.vibrate([500, 500, 500]);
      // this.toastr.error(error.message, 'Cerrar Sesión');
    }
  }

  redirectTo(path: string) {
    this.router.navigate([path]);
  }
}
