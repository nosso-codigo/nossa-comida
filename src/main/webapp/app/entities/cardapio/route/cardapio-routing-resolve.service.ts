import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICardapio, Cardapio } from '../cardapio.model';
import { CardapioService } from '../service/cardapio.service';

@Injectable({ providedIn: 'root' })
export class CardapioRoutingResolveService implements Resolve<ICardapio> {
  constructor(protected service: CardapioService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICardapio> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((cardapio: HttpResponse<Cardapio>) => {
          if (cardapio.body) {
            return of(cardapio.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Cardapio());
  }
}
