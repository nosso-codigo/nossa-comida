import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CardapioComponent } from './list/cardapio.component';
import { CardapioDetailComponent } from './detail/cardapio-detail.component';
import { CardapioUpdateComponent } from './update/cardapio-update.component';
import { CardapioDeleteDialogComponent } from './delete/cardapio-delete-dialog.component';
import { CardapioRoutingModule } from './route/cardapio-routing.module';

@NgModule({
  imports: [SharedModule, CardapioRoutingModule],
  declarations: [CardapioComponent, CardapioDetailComponent, CardapioUpdateComponent, CardapioDeleteDialogComponent],
  entryComponents: [CardapioDeleteDialogComponent],
})
export class CardapioModule {}
