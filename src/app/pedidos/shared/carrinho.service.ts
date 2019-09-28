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
  carrinhoPossuiItens() {
    return this.getCarrinhoProdutosRef().snapshotChanges().pipe(
      map(changes => {
        return changes.length > 0;
      })
    );
  }

  /*Recebe o preço e a quantidade e retorna o calculo de multiplicação do total */
  calcularTotal(preco: number, quantidade: number) {
    return preco * quantidade;
  }

  /*Acha o produto que está no carrinho pela key e recebe os dados para ser alterado*/
  update(key: string, quantidade: number, total: number) {
  /*update é um metodo do AngularFireList que recebe a quantidade de item e o total como dados e retorna se deu certo ou não*/
    return this.getCarrinhoProdutosRef().update(key, {quantidade: quantidade, total: total})
  }

  /*Remove um produto do carrinho através de sua key*/
  remove(key: string) {
    return this.getCarrinhoProdutosRef().remove(key);
  }

  /* Traz tudo que está no carrinho */
  getAll() {
    return this.getCarrinhoProdutosRef().snapshotChanges().pipe(
      map( changes => {
        return changes.map( m => ({key: m.payload.key, ...m.payload.val() }) )
      })
    )
  }
  /* */
  getTotalPedido() {
    return this.getCarrinhoProdutosRef().snapshotChanges().pipe(
      map(changes => {
        return changes
          .map( (m: any) => (m.payload.val().total))
          .reduce( (prev: number, current: number) => {
            return prev + current;
          })
      })
    )
  }

  clear() {

  }

}
