import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './paginas/home/home.component';

const routes: Routes = [
  {path:'home', component:HomeComponent, canActivate:[AuthGuard]},
  {
    path: 'usuarios',
    loadChildren: () => import('./paginas/usuarios/usuarios.module').then(m => m.UsuariosModule),
  },
  {
    path: 'mesa',
    loadChildren: () => import('./paginas/mesa/mesa.module').then(m => m.MesaModule),
  },
  {path:'**', redirectTo:'home', pathMatch:'full'},
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
