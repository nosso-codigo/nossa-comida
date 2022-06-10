import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICardapio } from '../cardapio.model';
import { CardapioService } from '../service/cardapio.service';
import { CardapioDeleteDialogComponent } from '../delete/cardapio-delete-dialog.component';

@Component({
  selector: 'jhi-cardapio',
  templateUrl: './cardapio.component.html',
})
export class CardapioComponent implements OnInit {
  cardapios?: ICardapio[];
  isLoading = false;

  constructor(protected cardapioService: CardapioService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.cardapioService.query().subscribe(
      (res: HttpResponse<ICardapio[]>) => {
        this.isLoading = false;
        this.cardapios = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICardapio): number {
    return item.id!;
  }

  delete(cardapio: ICardapio): void {
    const modalRef = this.modalService.open(CardapioDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.cardapio = cardapio;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
