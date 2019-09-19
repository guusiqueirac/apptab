import { ProdutosService } from './../shared/produtos.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-produtos',
  templateUrl: './lista-produtos.page.html',
  styleUrls: ['./lista-produtos.page.scss'],
})
export class ListaProdutosPage implements OnInit {
/* Variáveis para receber a lista do banco de dados*/
produtos: Observable<any[]>;
categorias: Observable<any[]>;

  constructor(private router: Router,
              private produtosService: ProdutosService) { }

  /*Comando que chama os metodos no service para listar os produtos e categorias*/
  ngOnInit() {
    this.produtos = this.produtosService.getAll();
    this.categorias = this.produtosService.getcategoriasAll();
  }



}
