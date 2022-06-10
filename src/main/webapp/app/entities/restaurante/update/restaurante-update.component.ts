import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IRestaurante, Restaurante } from '../restaurante.model';
import { RestauranteService } from '../service/restaurante.service';
import { IEndereco } from 'app/entities/endereco/endereco.model';
import { EnderecoService } from 'app/entities/endereco/service/endereco.service';

@Component({
  selector: 'jhi-restaurante-update',
  templateUrl: './restaurante-update.component.html',
})
export class RestauranteUpdateComponent implements OnInit {
  isSaving = false;

  enderecosCollection: IEndereco[] = [];

  editForm = this.fb.group({
    id: [],
    nome: [],
    endereco: [],
  });

  constructor(
    protected restauranteService: RestauranteService,
    protected enderecoService: EnderecoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ restaurante }) => {
      this.updateForm(restaurante);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const restaurante = this.createFromForm();
    if (restaurante.id !== undefined) {
      this.subscribeToSaveResponse(this.restauranteService.update(restaurante));
    } else {
      this.subscribeToSaveResponse(this.restauranteService.create(restaurante));
    }
  }

  trackEnderecoById(index: number, item: IEndereco): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRestaurante>>): void {
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

  protected updateForm(restaurante: IRestaurante): void {
    this.editForm.patchValue({
      id: restaurante.id,
      nome: restaurante.nome,
      endereco: restaurante.endereco,
    });

    this.enderecosCollection = this.enderecoService.addEnderecoToCollectionIfMissing(this.enderecosCollection, restaurante.endereco);
  }

  protected loadRelationshipsOptions(): void {
    this.enderecoService
      .query({ filter: 'restaurante-is-null' })
      .pipe(map((res: HttpResponse<IEndereco[]>) => res.body ?? []))
      .pipe(
        map((enderecos: IEndereco[]) =>
          this.enderecoService.addEnderecoToCollectionIfMissing(enderecos, this.editForm.get('endereco')!.value)
        )
      )
      .subscribe((enderecos: IEndereco[]) => (this.enderecosCollection = enderecos));
  }

  protected createFromForm(): IRestaurante {
    return {
      ...new Restaurante(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      endereco: this.editForm.get(['endereco'])!.value,
    };
  }
}
