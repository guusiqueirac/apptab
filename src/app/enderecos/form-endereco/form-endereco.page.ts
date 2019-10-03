import { ToastService } from './../../core/shared/toast.service';
import { EnderecoService } from './../shared/endereco.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-endereco',
  templateUrl: './form-endereco.page.html',
  styleUrls: ['./form-endereco.page.scss'],
})
export class FormEnderecoPage implements OnInit {
formEndereco: FormGroup;
key: string;

  constructor(private enderecoService: EnderecoService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private toast: ToastService) { }

  ngOnInit() {
    /*Ao abrir a página se não houver uma key irá abrir o formulário pra cadastrar um novo endereço*/
    this.criarFormulario();
    /*Faz uma consulta para saber se tem uma key, se houver, irá trazer todos os dados do endereço daquela key para editar*/
    let key = this.route.snapshot.paramMap.get('key');
    if (key) {
      const subscribe = this.enderecoService.getByKey(key).subscribe( (endereco: any) => {
        subscribe.unsubscribe();
        this.key = endereco.key;
        this.formEndereco.patchValue({
          cep: endereco.cep,
          logradouro: endereco.logradouro,
          numero: endereco.numero,
          complemento: endereco.complemento,
          bairro: endereco.bairro
        })
      })
    }
  }

  /*Campos para criar o formulário*/
  criarFormulario() {
    this.key = null;
    this.formEndereco = this.formBuilder.group({
      cep: [''],
      logradouro: [''],
      numero: [''],
      complemento: [''],
      bairro: ['']
    });
  }

  /*Recebe os dados e entrega para o service, se houver key ele chama o metodo de update, senão ele apenas insere um novo endereço*/
  onSubmit() {
    if (this.formEndereco.valid) {
      let result: Promise<{}>;
      if (this.key) {
        result = this.enderecoService.update(this.formEndereco.value, this.key);
      } else {
        result = this.enderecoService.insert(this.formEndereco.value);
      }

      result
      .then( () => {
        this.toast.show('Endereço salvo com sucesso');
        if (!this.key) {
          this.criarFormulario();
        }
        this.router.navigate(['/usuarios/enderecos']);
    
      })
      .catch( () => {
        this.toast.show('Erro ao salvar o endereco');
      })
    }
  }

}
