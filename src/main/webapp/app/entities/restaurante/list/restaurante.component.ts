import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRestaurante } from '../restaurante.model';
import { RestauranteService } from '../service/restaurante.service';
import { RestauranteDeleteDialogComponent } from '../delete/restaurante-delete-dialog.component';

@Component({
  selector: 'jhi-restaurante',
  templateUrl: './restaurante.component.html',
})
export class RestauranteComponent implements OnInit {
  restaurantes?: IRestaurante[];
  isLoading = false;

  constructor(protected restauranteService: RestauranteService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.restauranteService.query().subscribe(
      (res: HttpResponse<IRestaurante[]>) => {
        this.isLoading = false;
        this.restaurantes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IRestaurante): number {
    return item.id!;
  }

  delete(restaurante: IRestaurante): void {
    const modalRef = this.modalService.open(RestauranteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.restaurante = restaurante;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
