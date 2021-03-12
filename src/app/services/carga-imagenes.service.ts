import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FileItem } from '../models/file-item';
import * as firebase from 'firebase';



@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {

  private CARPETA_IMAGENES = 'img';

  constructor( private db: AngularFirestore ) { }

  cargarImagenesDesdeFirebase( imagenes: FileItem[] ){
    //console.log( imagenes );
    const storageRef = firebase.default.storage().ref();

    for ( const item of imagenes ){
      item.estaSubiendo = true;
      if ( item.progreso >= 100 ){
        continue;
      }
      // Tarea de subida
      const uploadTask: firebase.default.storage.UploadTask = storageRef.child(`${ this.CARPETA_IMAGENES }/${ item.nombreArchivo }`)
        .put( item.archivo );

      uploadTask.on( firebase.default.storage.TaskEvent.STATE_CHANGED,
            ( snapshot ) => item.progreso = ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100,
            ( error ) => console.error('Error al subir', error),
            () => {

              console.log('Imagen cargada correctamente')
              item.url = uploadTask.snapshot.downloadURL;
              item.estaSubiendo = false;
              this.guardarImagenEnFirebase({
                nombre: item.nombreArchivo,
                url: item.url
              });
            });
    }
  }

  guardarImagenEnFirebase( imagen: {nombre: string, url: string} ){
    this.db.collection(`${ this.CARPETA_IMAGENES }`)
      .add( imagen );
  }

}
