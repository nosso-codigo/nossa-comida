import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'endereco',
        data: { pageTitle: 'nossaComidaApp.endereco.home.title' },
        loadChildren: () => import('./endereco/endereco.module').then(m => m.EnderecoModule),
      },
      {
        path: 'restaurante',
        data: { pageTitle: 'nossaComidaApp.restaurante.home.title' },
        loadChildren: () => import('./restaurante/restaurante.module').then(m => m.RestauranteModule),
      },
      {
        path: 'cardapio',
        data: { pageTitle: 'nossaComidaApp.cardapio.home.title' },
        loadChildren: () => import('./cardapio/cardapio.module').then(m => m.CardapioModule),
      },
      {
        path: 'prato',
        data: { pageTitle: 'nossaComidaApp.prato.home.title' },
        loadChildren: () => import('./prato/prato.module').then(m => m.PratoModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
