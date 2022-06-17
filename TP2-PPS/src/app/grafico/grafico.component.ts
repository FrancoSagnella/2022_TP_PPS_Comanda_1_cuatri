import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { GraficoService } from '../services/grafico.service';

@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',
  styleUrls: ['./grafico.component.scss'],
})
export class GraficoComponent implements OnInit {
  chart:any;
  chartCovid:any;
  chartSatisfecho:any;
  listadoSal:any[] = [];
  listadoProtocoloCovid:any[] = [];
  listadoSatisfecho:any[] = [];


  constructor(private grafico:GraficoService, private fires:FirestoreService) { }

  ngOnInit() {
    this.fires.obtenerTodos('encuestasCliente').subscribe(turnos=>{
      let sal:any[] = [];
      let protocloCovid:any[] = [];
      let satisfecho:any[] = [];

      turnos.forEach(element => {
        let data:any = element.payload.doc.data();
//alert(data.mesaConSal)
         // console.log(element)
          if(sal.length == 0 && protocloCovid.length == 0 && satisfecho.length == 0)
          {
            sal.push({estado:data.mesaConSal, cant:1});
            protocloCovid.push({estado:data.protocoloCovid, cant:1});
            satisfecho.push({puntos:data.rangoSatisfecho, cant:1});
          }
          else{
              let aux = true;
              let auxCovid=true;
              let auxSatisfecho=true;
              sal.forEach(dia => {
                if(dia.estado == data.mesaConSal)
                {
                  dia.cant++;
                  aux = false;
                }
              });

              protocloCovid.forEach(dia => {
                if(dia.estado == data.protocoloCovid)
                {
                  dia.cant++;
                  auxCovid = false;
                }
              });

              satisfecho.forEach(dia => {
                if(dia.estado == data.rangoSatisfecho)
                {
                  dia.cant++;
                  auxSatisfecho = false;
                }
              });

              if(aux)
              {
                sal.push({estado:data.mesaConSal, cant:1});
              }
              if(auxCovid)
              {
                protocloCovid.push({estado:data.protocoloCovid, cant:1});
              }
              if(auxSatisfecho)
              {
                satisfecho.push({puntos:data.rangoSatisfecho, cant:1});
              }
            }
        

      });

      this.listadoSal = sal;
      this.listadoProtocoloCovid = protocloCovid;
      this.listadoSatisfecho = satisfecho;
console.log(this.listadoSatisfecho)
      this.crearGrafico();
      this.crearGraficoCovid();
      this.crearGraficoSatisfecho();
})
    // this.crearGrafico()
  }
  crearGrafico()
  {
    let respuesta:any[] = [];
    let cantidad:any[] = []; 
    let total:any;   
    let hola:any[]=[]

    this.listadoSal.forEach(element => {
      let verdadero:any=''
      if(element.estado){
        respuesta.push("Si");
        verdadero='Si'
      }
      else{
        respuesta.push("No");
        verdadero='No'
      }
      
      hola.push([verdadero,element.cant])
      cantidad.push(element.cant);
    });
    console.log(hola)
console.log(this.listadoSal)
    this.chart = this.grafico.crearGraficoBarras(respuesta, hola, '¿Tenia protocolo para el covid?', 'Respuestas', 'cantidad de votos', 'Respuestas');
  }

  crearGraficoCovid()
  {    let hola:any[]=[]

    let respuesta:any[] = [];
    let cantidad:any[] = [];
    this.listadoProtocoloCovid.forEach(element => {
      let verdadero:any=''

      if(element.estado){
        verdadero='Si'

        respuesta.push("Si");
      }
      else{
        respuesta.push("No");
        verdadero='No'

      }
              hola.push([verdadero,element.cant])

      cantidad.push(element.cant);
    });

    this.chartCovid = this.grafico.crearGraficoBarras(respuesta, hola, '¿Tenia sal la mesa?', 'Respuestas', 'cantidad de votos', 'Respuestas');
  }

  crearGraficoSatisfecho()
  {
    let hola:any[]=[]
    let estrellas:any=''

    let respuesta:any[] = [];
    let cantidad:any[] = [];
    this.listadoSatisfecho.forEach(element => {
      estrellas='('+element.puntos+')'+' ⭐'
      console.log(estrellas)

      for(let i=1;i<element.puntos;i++){
        estrellas+='⭐'
        console.log(estrellas)

      }
      //alert(estrellas)
        respuesta.push(element.puntos);
      
        hola.push([estrellas,element.cant])

      cantidad.push(element.cant);
    });

    this.chartSatisfecho = this.grafico.crearGraficoBarras(respuesta, hola, '¿Calificacion del establecimiento (del 1 al 5)⭐?', 'puntaje', 'cantidad de votos', 'Respuestas');
  }
}
