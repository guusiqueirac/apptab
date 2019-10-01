import { ToastService } from './../../core/shared/toast.service';
import { EnderecoService } from './../shared/endereco.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
              private toast: ToastService) { }

  ngOnInit() {
    this.criarFormulario();
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
      })
      .catch( () => {
        this.toast.show('Erro ao salvar o endereco');
      })
    }
  }

}
