import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FirebasePath } from 'src/app/core/shared/firebase-path';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {

  constructor(private db: AngularFireDatabase) { }

  /*Pegar todos produtos e listar*/
  getAll(categoriaKey: string = null) {
    return this.db.list ( FirebasePath.PRODUTOS, q => {
      if (categoriaKey) {
        return q.orderByChild('categoriaKey').equalTo(categoriaKey);
      } else {
        return q.orderByChild('nome');
      }
    }).snapshotChanges().pipe(
      map(changes => {
        return changes.map(m => ({key: m.payload.key, ...m.payload.val() }));
      })
    )
  }

  /*Pegar todas categorias e listar*/
  getcategoriasAll() {
    return this.db.list(FirebasePath.CATEGORIAS).snapshotChanges().pipe(
      map(changes => {
        return changes.map(m => ({ key: m.payload.key, ...m.payload.val() }))
      })
    );
  }
  //Buscar o produto através de sua key
  getByKey(key: string){
    /*Contrução do path, o $ serve para concatenar as variaveis com constante*/
    const path = `${FirebasePath.PRODUTOS}${key}`;
    return this.db.object(path).snapshotChanges().pipe(
      map(change => {
        return ({ key: change.key, ...change.payload.val() });
      })
    );
  }
  
}
