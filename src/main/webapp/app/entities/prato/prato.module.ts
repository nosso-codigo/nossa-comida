import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PratoComponent } from './list/prato.component';
import { PratoDetailComponent } from './detail/prato-detail.component';
import { PratoUpdateComponent } from './update/prato-update.component';
import { PratoDeleteDialogComponent } from './delete/prato-delete-dialog.component';
import { PratoRoutingModule } from './route/prato-routing.module';

@NgModule({
  imports: [SharedModule, PratoRoutingModule],
  declarations: [PratoComponent, PratoDetailComponent, PratoUpdateComponent, PratoDeleteDialogComponent],
  entryComponents: [PratoDeleteDialogComponent],
})
export class PratoModule {}
