import { ToastService } from './../../core/shared/toast.service';
import { AlertService } from './../../core/shared/alert.service';
import { EnderecoService } from './../shared/endereco.service';
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-lista-endereco',
  templateUrl: './lista-endereco.page.html',
  styleUrls: ['./lista-endereco.page.scss'],
})
export class ListaEnderecoPage implements OnInit {
enderecos: Observable<any[]>;
@Input()
selecionadorEndereco: boolean = false;

  constructor(private enderecoService: EnderecoService,
              private alert: AlertService,
              private toast: ToastService,
              private router: Router,
              private modalController: ModalController) { }

  /*Atraves do Obsavable, o endereco traz todos os endereços que foram cadastrados*/
  ngOnInit() {
    this.enderecos = this.enderecoService.getAll();
  }

  /*Recebo o que tem em endereco e coloca na variável enderecoText e vai concatenando para mostrar em uma linha só*/
  getEnderecoText(endereco: any) {
    let enderecoText: '';
    enderecoText = endereco.logradouro;
    enderecoText += ', ' + endereco.numero;
    if (endereco.complemento) {
        enderecoText += ', ' + endereco.complemento;
      }
    enderecoText += ' - ' + endereco.bairro;
    enderecoText += ' - ' + endereco.cep;
    console.log(enderecoText);
    return enderecoText;
  }

  setEnderecoSelecionado(endereco: any) {
    if (this.selecionadorEndereco) {
      const enderecoText = this.getEnderecoText(endereco);
      this.modalController.dismiss({ endereco: enderecoText });
    }
  }

  /*Recebe a key do endereço e envia para a rota de editar*/
  editar(key: string) {
    this.router.navigate(['/usuarios/enderecos/editar', key]);
    
  }

  /*Recebe a key do endereço e abre a janelinha para confirma a remoção ou cancelar*/
  remover(endereco: any) {
    this.alert.ShowConfirmaExclusao(endereco.logradouro + ', ' + endereco.numero, () => {
      this.enderecoService.remove(endereco.key)
        .then( () => {
          this.toast.show('Endereço removido com sucesso !');
        })
    })
  }
}
