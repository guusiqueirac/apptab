import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { FirebasePath } from 'src/app/core/shared/firebase-path';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {

  constructor(private db: AngularFireDatabase,
              private afAuth: AngularFireAuth) { }

  /*Cria o caminho para adicionar um produto - enderecos/id do cliente */
  getEnderecosPath() {
    const path = `${FirebasePath.CLIENTES_ENDERECOS}${this.afAuth.auth.currentUser.uid}`
    return path;
  }

  /*Recebe o caminho dos endereços pelo path e vira uma referência para os endereços*/
  getEnderecosRef() {
    const path = this.getEnderecosPath();
    return this.db.list(path);
  }

  /*Mapea cada endereço*/
  getAll() {
    return this.getEnderecosRef().snapshotChanges().pipe(
      map (change => {
        return change.map( m => ({key: m.payload.key, ...m.payload.val() }) );
      })
    )
  }

  /*Traz apenas um endereço através de sua key*/
  getByKey(key: string) {
    const path = `${this.getEnderecosPath()}/${key}`;
    return this.db.object(path).snapshotChanges().pipe(
      map( change => {
        return ({ key: change.key, ...change.payload.val() })
      })
    );
  }

  /*Recebe o  endereço e insere no banco*/
  insert(endereco: any) {
    return this.save(endereco, null);
  }

  /*Recebe o endereço e a key e altera os dados*/
  update(endereco: any, key: string) {
    return this.save(endereco, key);
  }

  /*Metodo para salvar ou atulizar no banco*/
  private save(endereco: any, key: string) {
    return new Promise( (resolve, reject) => {
      const enderecoRef = this.getEnderecosRef();
      /*Se tiver uma key ele chama o metodo de update*/
      if (key) {
      enderecoRef.update(key, endereco)
        .then( () => resolve(key))
        .catch( () => reject());
      /*Se não houver um key ele insere o endereço no banco*/
      } else {
      enderecoRef.push(endereco)
        .then( (result: any) => resolve(result.key) );
      }
    });
  }

  /*Recebe o endereco e a key e remove*/
  remove(key: string) {
    return this.getEnderecosRef().remove(key);
  }


}
