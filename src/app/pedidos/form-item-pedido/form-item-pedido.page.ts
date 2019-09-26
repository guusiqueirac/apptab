import { ToastService } from './../../core/shared/toast.service';
import { CarrinhoService } from './../shared/carrinho.service';
import { ProdutosService } from './../../produtos/shared/produtos.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-item-pedido',
  templateUrl: './form-item-pedido.page.html',
  styleUrls: ['./form-item-pedido.page.scss'],
})
export class FormItemPedidoPage implements OnInit {
produto: any = {};
form: FormGroup;
total: number = 0;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private produtosService: ProdutosService,
              private carrinhoService: CarrinhoService,
              private toast: ToastService) { }

  /*Trazer os detalhes do pedido para a page só de um produto*/
  ngOnInit() {
    this.criarFormulario();
    let key = this.route.snapshot.paramMap.get('key');
    if (key) {
      const subscribe = this.produtosService.getByKey(key).subscribe( (produto: any ) => {
        subscribe.unsubscribe();
        this.produto = produto;

        this.form.patchValue({
          produtoKey: produto.key,
          produtoNome: produto.nome,
          produtoDescricao: produto.descricao,
          produtoPreco: produto.preco,
          quantidade: 1
        })

        /*Mostra o total calculado*/
        this.executaCalcularTotal();
      })
    }
  }

  /*Page apenas de um produto, para pegar informações que o cliente escolheu e adicionar ao carrinho*/
  criarFormulario() {
    this.form = this.formBuilder.group({
      produtoKey: [''],
      produtoNome: [''],
      produtoDescricao: [''],
      produtoPreco: [''],
      quantidade: [''],
      observacao: [''],
      total: ['']
    })
  }

  /*Busca o metodo de calculo e executa*/
  executaCalcularTotal() {
    this.atualizaTotal(this.form.value.quantidade);
  }

  /*Adiciona a quantidade através do botão de " + ", pega a quantidade joga em uma váriavel e manda para o atualizaTotal */
  adicionarQuantidade() {
    let qtd = this.form.value.quantidade;
    qtd++;
    this.atualizaTotal(qtd);
  }

  /*Diminui a quantidade através do botão de retirar " - ", pega a quantidade joga em uma váriavel e manda para o atualizaTotal */
  removerQuantidade() {
    let qtd = this.form.value.quantidade;
    qtd--;
    if(qtd <= 0)
      qtd = 1;

    this.atualizaTotal(qtd);
  }

  /*Receber o preço e a quantidade e efetuar a conta de multiplicação para calcular o total*/
  atualizaTotal(quantidade: number) {
    this.total = this.produto.preco * quantidade;
    this.form.patchValue({ quantidade: quantidade, total: this.total});
  }

  /*Se o valores do formulario estiverem todos preenchidos (validos), ira buscar o metodo inserir no carrinhoService*/
  /*Se deu certo ele irá mostrar a mensagem de que deu certo e volta pra page produtos*/
  onSubmit(){
    if(this.form.valid){
      this.carrinhoService.insert(this.form.value)
      .then( () => {
        this.toast.show('Produto adicionado ao carrinho com sucesso !');
        this.router.navigate(['/tabs/produtos']);
      })
    }
  }

}
