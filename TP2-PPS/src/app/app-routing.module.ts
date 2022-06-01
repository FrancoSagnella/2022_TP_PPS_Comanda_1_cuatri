import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './paginas/home/home.component';

const routes: Routes = [
  {path:'home', component:HomeComponent},
  {
    path: 'usuarios',
    loadChildren: () => import('./paginas/usuarios/usuarios.module').then(m => m.UsuariosModule),
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
