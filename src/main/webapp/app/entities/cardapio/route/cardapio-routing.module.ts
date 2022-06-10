import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CardapioComponent } from '../list/cardapio.component';
import { CardapioDetailComponent } from '../detail/cardapio-detail.component';
import { CardapioUpdateComponent } from '../update/cardapio-update.component';
import { CardapioRoutingResolveService } from './cardapio-routing-resolve.service';

const cardapioRoute: Routes = [
  {
    path: '',
    component: CardapioComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CardapioDetailComponent,
    resolve: {
      cardapio: CardapioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CardapioUpdateComponent,
    resolve: {
      cardapio: CardapioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CardapioUpdateComponent,
    resolve: {
      cardapio: CardapioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(cardapioRoute)],
  exports: [RouterModule],
})
export class CardapioRoutingModule {}
