import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Photo } from '@capacitor/camera';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private coleccionMensaje:AngularFirestoreCollection<any>;

  constructor(private firestore:AngularFirestore,private storage:AngularFireStorage) {
    this.coleccionMensaje=firestore.collection<any>('mensajes');
   }

   guardarMensajeFirestore(datos:any){
     this.coleccionMensaje.add(datos);
   }

  //Crea un nuevo dato
  public crear(collection: string, data: any) {
    return this.firestore.collection(collection).add(data);
  }
  //Obtiene un datos
  public obtenerById(collection:string, documentId: string) {
    return this.firestore.collection(collection).doc(documentId).get();
  }
  //Obtiene todos los datos
  public obtenerTodos(collection: string) {
    return this.firestore.collection(collection).snapshotChanges();
  }
  //Actualiza un dato
  public actualizar(collection: string, documentId: string, data: any) {
    return this.firestore.collection(collection).doc(documentId).set(data);
  }

  async saveImage(img: Photo, path: string, name: string) {
    try {
      const response = await fetch(img.webPath!);
      const blob = await response.blob();
      const filePath = path + '/' + name;
      const uploadTask = this.saveFile(blob, filePath);

      return (await uploadTask).ref.getDownloadURL();
    }
    catch (error) { }
  }

  saveFile(file: Blob, filePath: string) {
    return this.storage.upload(filePath, file);
  }
}
