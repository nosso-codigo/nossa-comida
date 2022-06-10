import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICardapio, Cardapio } from '../cardapio.model';
import { CardapioService } from '../service/cardapio.service';
import { IRestaurante } from 'app/entities/restaurante/restaurante.model';
import { RestauranteService } from 'app/entities/restaurante/service/restaurante.service';

@Component({
  selector: 'jhi-cardapio-update',
  templateUrl: './cardapio-update.component.html',
})
export class CardapioUpdateComponent implements OnInit {
  isSaving = false;

  restaurantesCollection: IRestaurante[] = [];

  editForm = this.fb.group({
    id: [],
    nome: [],
    restaurante: [],
  });

  constructor(
    protected cardapioService: CardapioService,
    protected restauranteService: RestauranteService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cardapio }) => {
      this.updateForm(cardapio);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cardapio = this.createFromForm();
    if (cardapio.id !== undefined) {
      this.subscribeToSaveResponse(this.cardapioService.update(cardapio));
    } else {
      this.subscribeToSaveResponse(this.cardapioService.create(cardapio));
    }
  }

  trackRestauranteById(index: number, item: IRestaurante): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICardapio>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(cardapio: ICardapio): void {
    this.editForm.patchValue({
      id: cardapio.id,
      nome: cardapio.nome,
      restaurante: cardapio.restaurante,
    });

    this.restaurantesCollection = this.restauranteService.addRestauranteToCollectionIfMissing(
      this.restaurantesCollection,
      cardapio.restaurante
    );
  }

  protected loadRelationshipsOptions(): void {
    this.restauranteService
      .query({ filter: 'cardapio-is-null' })
      .pipe(map((res: HttpResponse<IRestaurante[]>) => res.body ?? []))
      .pipe(
        map((restaurantes: IRestaurante[]) =>
          this.restauranteService.addRestauranteToCollectionIfMissing(restaurantes, this.editForm.get('restaurante')!.value)
        )
      )
      .subscribe((restaurantes: IRestaurante[]) => (this.restaurantesCollection = restaurantes));
  }

  protected createFromForm(): ICardapio {
    return {
      ...new Cardapio(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      restaurante: this.editForm.get(['restaurante'])!.value,
    };
  }
}
