import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebasePath } from 'src/app/core/shared/firebase-path';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  constructor(private db: AngularFireDatabase,
              private afAuth: AngularFireAuth) { }

  /*Cria a referência do carrinho para adiconar o produto, concatenando a rota do carrinho/id do usuario/ e produto*/
  getCarrinhoProdutosRef() {
    const path = `${FirebasePath.CARRINHO}${this.afAuth.auth.currentUser.uid}/${FirebasePath.PRODUTOS}`;
    return this.db.list(path);
  }

  /*Insere o produto com suas descrições no carrinho*/
  insert(itemProduto: any) {
    return this.getCarrinhoProdutosRef().push(itemProduto);
  }

  /*Fazer uma consulta dentro do carrinho para saber se tem algum produto lá*/
  carrinhoPossuiItens(){
    return this.getCarrinhoProdutosRef().snapshotChanges().pipe(
      map(changes => {
        return changes.length > 0
      })
    )
  }


}
