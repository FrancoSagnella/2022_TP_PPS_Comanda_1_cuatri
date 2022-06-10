import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  protected itemsCollection: AngularFirestoreCollection<any>;
    items: Observable<any[]>;   

  constructor(private fire: AngularFirestore ){
    this.itemsCollection = this.fire.collection("Chats");
  } 

  setChatCollection(mesaCliente?:string){
    let collName = "Chats";
    this.setCollFilter(mesaCliente, collName, "fecha", "mesaClienteId");
  }

  protected setCollFilter(valueFilter:string, collName:string, field:string, filterField:string){
    this.itemsCollection = this.fire.collection<any>(collName, ref => ref
      .where(filterField, '==', valueFilter)
      .orderBy(field, "asc"));
    this.items = this.itemsCollection.valueChanges();
  }

  setItemWithId(item: any, id:string) {
    return this.itemsCollection.doc(id).set(Object.assign({}, item));    
  }


  traerMensajes(){ 
    this.itemsCollection =  this.fire.collection('Chats', 
                                      ref => ref.orderBy('fecha',  "asc")       
                                    );  
      return this.itemsCollection.valueChanges(); 
  }
}
