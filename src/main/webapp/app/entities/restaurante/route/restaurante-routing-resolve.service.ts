import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRestaurante, Restaurante } from '../restaurante.model';
import { RestauranteService } from '../service/restaurante.service';

@Injectable({ providedIn: 'root' })
export class RestauranteRoutingResolveService implements Resolve<IRestaurante> {
  constructor(protected service: RestauranteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRestaurante> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((restaurante: HttpResponse<Restaurante>) => {
          if (restaurante.body) {
            return of(restaurante.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Restaurante());
  }
}
