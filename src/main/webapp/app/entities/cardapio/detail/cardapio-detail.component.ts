import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICardapio } from '../cardapio.model';

@Component({
  selector: 'jhi-cardapio-detail',
  templateUrl: './cardapio-detail.component.html',
})
export class CardapioDetailComponent implements OnInit {
  cardapio: ICardapio | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cardapio }) => {
      this.cardapio = cardapio;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
