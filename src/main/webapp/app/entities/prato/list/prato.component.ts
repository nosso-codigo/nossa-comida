import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPrato } from '../prato.model';
import { PratoService } from '../service/prato.service';
import { PratoDeleteDialogComponent } from '../delete/prato-delete-dialog.component';

@Component({
  selector: 'jhi-prato',
  templateUrl: './prato.component.html',
})
export class PratoComponent implements OnInit {
  pratoes?: IPrato[];
  isLoading = false;

  constructor(protected pratoService: PratoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.pratoService.query().subscribe(
      (res: HttpResponse<IPrato[]>) => {
        this.isLoading = false;
        this.pratoes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPrato): number {
    return item.id!;
  }

  delete(prato: IPrato): void {
    const modalRef = this.modalService.open(PratoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.prato = prato;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
