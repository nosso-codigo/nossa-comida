import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PratoComponent } from '../list/prato.component';
import { PratoDetailComponent } from '../detail/prato-detail.component';
import { PratoUpdateComponent } from '../update/prato-update.component';
import { PratoRoutingResolveService } from './prato-routing-resolve.service';

const pratoRoute: Routes = [
  {
    path: '',
    component: PratoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PratoDetailComponent,
    resolve: {
      prato: PratoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PratoUpdateComponent,
    resolve: {
      prato: PratoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PratoUpdateComponent,
    resolve: {
      prato: PratoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(pratoRoute)],
  exports: [RouterModule],
})
export class PratoRoutingModule {}
