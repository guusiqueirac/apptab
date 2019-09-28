import { AlertService } from './../../core/shared/alert.service';
import { CarrinhoService } from './../shared/carrinho.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lista-item-pedido',
  templateUrl: './lista-item-pedido.page.html',
  styleUrls: ['./lista-item-pedido.page.scss'],
})
export class ListaItemPedidoPage implements OnInit {
itensPedido: Observable<any[]>;
total: number;

  constructor(private carrinhoService: CarrinhoService,
              private alert: AlertService) { }

    /*Executa todos os metodos que estão dentro*/
  ngOnInit() {
    /*Traz todos os itens no carrinho com seus dados*/
    this.itensPedido = this.carrinhoService.getAll();
    /*Busca do metodo getTotalPedio o total de todos os produtos que estão no carrinho e mostra*/
    this.getTotalPedido();
  }

  /*Busca as informações do total no banco*/
  getTotalPedido() {
    const subscribe = this.carrinhoService.getTotalPedido().subscribe( (total: number) => {
      subscribe.unsubscribe();
      this.total = total;
    })
  }

  /*Adiciona a quantidade através do botão de " + ", pega a quantidade joga em uma váriavel e manda para o atualizaTotal */
  adicionarQuantidade(itemPedido: any) {
    let qtd = itemPedido.quantidade;
    qtd++;

    this.atualizarTotal(itemPedido, qtd);
  }

  /*Diminui a quantidade através do botão de retirar " - ", pega a quantidade joga em uma váriavel e manda para o atualizaTotal */
  removerQuantidade(itemPedido: any) {
    let qtd = itemPedido.quantidade;
    qtd--;

    /*Se a quantidade for menor ou igual a zero irá executar o metodo de remover o produto, senão irá apenas atualizar */
    if (qtd <= 0) {
      this.removerProduto(itemPedido);
    } else {
      this.atualizarTotal(itemPedido, qtd);
    }
  }

  /*Faz uma atualização do total toda vez que é adicionado ou removido algum produto */
  atualizarTotal(itemPedido: any, quantidade: number) {
    const total = this.carrinhoService.calcularTotal(itemPedido.produtoPreco, quantidade);
    this.carrinhoService.update(itemPedido.key, quantidade, total);
    this.getTotalPedido();
  }

  /*Remove o produto do carrinho e do banco*/
  removerProduto(itemPedido: any) {
    this.alert.ShowConfirmaExclusao(itemPedido.produtoNome, () => {
      this.carrinhoService.remove(itemPedido.key);
      /*Assim que remover algum produto do carrinho, chama o metodo para atualizar o total do pedido*/
      this.getTotalPedido();
    })
  }

}
