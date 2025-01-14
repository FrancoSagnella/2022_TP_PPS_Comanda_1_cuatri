import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { GraficoComponent } from './grafico/grafico.component';
import { AuthGuard } from './guards/auth.guard';
import { ChatMozoComponent } from './paginas/chat-mozo/chat-mozo.component';
import { ChatComponent } from './paginas/chat/chat.component';
import { IdComponent } from './paginas/game/id/id.component';
import { Juego15Component } from './paginas/game/juego15/juego15.component';
import { Juego20Component } from './paginas/game/juego20/juego20.component';
import { HomeComponent } from './paginas/home/home.component';
import { AltaComponent } from './paginas/producto/alta/alta.component';

import { ListComponent } from './paginas/wait/list/list.component';

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
  {
    path: 'producto',
    loadChildren: () => import('./paginas/producto/producto.module').then(m => m.ProductoModule),
  },
  {
    path: 'pedido',
    loadChildren: () => import('./paginas/pedidos/pedidos.module').then(m => m.PedidosModule),
  },
  {
    path: 'encuesta',
    loadChildren: () => import('./paginas/encuesta/encuesta.module').then(m => m.EncuestaModule),
  },
  {path:'wait/list', component:ListComponent},
  {path:'chat', component:ChatComponent},
  {path:'chatMozo', component:ChatMozoComponent},
  {path:'grafico', component:GraficoComponent},
  {path:'game/:id', component:IdComponent},
  {path:'juego15/:id', component:Juego15Component},
  {path:'juego20/:id', component:Juego20Component},

  {path:'**', redirectTo:'login', pathMatch:'full'},
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
