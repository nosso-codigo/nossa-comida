import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RestauranteComponent } from '../list/restaurante.component';
import { RestauranteDetailComponent } from '../detail/restaurante-detail.component';
import { RestauranteUpdateComponent } from '../update/restaurante-update.component';
import { RestauranteRoutingResolveService } from './restaurante-routing-resolve.service';

const restauranteRoute: Routes = [
  {
    path: '',
    component: RestauranteComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RestauranteDetailComponent,
    resolve: {
      restaurante: RestauranteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RestauranteUpdateComponent,
    resolve: {
      restaurante: RestauranteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RestauranteUpdateComponent,
    resolve: {
      restaurante: RestauranteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(restauranteRoute)],
  exports: [RouterModule],
})
export class RestauranteRoutingModule {}
