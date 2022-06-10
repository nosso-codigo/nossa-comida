import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPrato, Prato } from '../prato.model';
import { PratoService } from '../service/prato.service';

@Injectable({ providedIn: 'root' })
export class PratoRoutingResolveService implements Resolve<IPrato> {
  constructor(protected service: PratoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPrato> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((prato: HttpResponse<Prato>) => {
          if (prato.body) {
            return of(prato.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Prato());
  }
}
