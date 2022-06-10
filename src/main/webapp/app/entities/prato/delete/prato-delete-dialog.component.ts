import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPrato } from '../prato.model';
import { PratoService } from '../service/prato.service';

@Component({
  templateUrl: './prato-delete-dialog.component.html',
})
export class PratoDeleteDialogComponent {
  prato?: IPrato;

  constructor(protected pratoService: PratoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pratoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
