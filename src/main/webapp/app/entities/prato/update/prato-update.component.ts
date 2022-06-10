import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPrato, Prato } from '../prato.model';
import { PratoService } from '../service/prato.service';
import { ICardapio } from 'app/entities/cardapio/cardapio.model';
import { CardapioService } from 'app/entities/cardapio/service/cardapio.service';

@Component({
  selector: 'jhi-prato-update',
  templateUrl: './prato-update.component.html',
})
export class PratoUpdateComponent implements OnInit {
  isSaving = false;

  cardapiosSharedCollection: ICardapio[] = [];

  editForm = this.fb.group({
    id: [],
    nome: [],
    cardapio: [],
  });

  constructor(
    protected pratoService: PratoService,
    protected cardapioService: CardapioService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ prato }) => {
      this.updateForm(prato);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const prato = this.createFromForm();
    if (prato.id !== undefined) {
      this.subscribeToSaveResponse(this.pratoService.update(prato));
    } else {
      this.subscribeToSaveResponse(this.pratoService.create(prato));
    }
  }

  trackCardapioById(index: number, item: ICardapio): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPrato>>): void {
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

  protected updateForm(prato: IPrato): void {
    this.editForm.patchValue({
      id: prato.id,
      nome: prato.nome,
      cardapio: prato.cardapio,
    });

    this.cardapiosSharedCollection = this.cardapioService.addCardapioToCollectionIfMissing(this.cardapiosSharedCollection, prato.cardapio);
  }

  protected loadRelationshipsOptions(): void {
    this.cardapioService
      .query()
      .pipe(map((res: HttpResponse<ICardapio[]>) => res.body ?? []))
      .pipe(
        map((cardapios: ICardapio[]) =>
          this.cardapioService.addCardapioToCollectionIfMissing(cardapios, this.editForm.get('cardapio')!.value)
        )
      )
      .subscribe((cardapios: ICardapio[]) => (this.cardapiosSharedCollection = cardapios));
  }

  protected createFromForm(): IPrato {
    return {
      ...new Prato(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      cardapio: this.editForm.get(['cardapio'])!.value,
    };
  }
}
