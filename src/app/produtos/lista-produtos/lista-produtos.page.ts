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
produtos: Observable<any[]>;

  constructor(private router: Router,
              private produtosService: ProdutosService) { }

  ngOnInit() {
    this.produtos = this.produtosService.getAll();
  }

}
