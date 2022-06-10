import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRestaurante } from '../restaurante.model';
import { RestauranteService } from '../service/restaurante.service';

@Component({
  templateUrl: './restaurante-delete-dialog.component.html',
})
export class RestauranteDeleteDialogComponent {
  restaurante?: IRestaurante;

  constructor(protected restauranteService: RestauranteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.restauranteService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
