import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RestauranteComponent } from './list/restaurante.component';
import { RestauranteDetailComponent } from './detail/restaurante-detail.component';
import { RestauranteUpdateComponent } from './update/restaurante-update.component';
import { RestauranteDeleteDialogComponent } from './delete/restaurante-delete-dialog.component';
import { RestauranteRoutingModule } from './route/restaurante-routing.module';

@NgModule({
  imports: [SharedModule, RestauranteRoutingModule],
  declarations: [RestauranteComponent, RestauranteDetailComponent, RestauranteUpdateComponent, RestauranteDeleteDialogComponent],
  entryComponents: [RestauranteDeleteDialogComponent],
})
export class RestauranteModule {}
