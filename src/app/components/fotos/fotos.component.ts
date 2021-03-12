import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Item { name: string; url: string; }

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styles: [
  ]
})
export class FotosComponent implements OnInit {

  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<any[]>;

  constructor( afs: AngularFirestore ) {
    this.itemsCollection = afs.collection<Item>('img');
    this.items = afs.collection('items').valueChanges();
  }

  ngOnInit(): void {
  }

}
