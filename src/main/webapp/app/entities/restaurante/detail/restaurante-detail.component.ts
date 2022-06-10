import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRestaurante } from '../restaurante.model';

@Component({
  selector: 'jhi-restaurante-detail',
  templateUrl: './restaurante-detail.component.html',
})
export class RestauranteDetailComponent implements OnInit {
  restaurante: IRestaurante | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ restaurante }) => {
      this.restaurante = restaurante;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
