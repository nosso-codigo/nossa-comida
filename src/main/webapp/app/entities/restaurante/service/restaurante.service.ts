import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRestaurante, getRestauranteIdentifier } from '../restaurante.model';

export type EntityResponseType = HttpResponse<IRestaurante>;
export type EntityArrayResponseType = HttpResponse<IRestaurante[]>;

@Injectable({ providedIn: 'root' })
export class RestauranteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/restaurantes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(restaurante: IRestaurante): Observable<EntityResponseType> {
    return this.http.post<IRestaurante>(this.resourceUrl, restaurante, { observe: 'response' });
  }

  update(restaurante: IRestaurante): Observable<EntityResponseType> {
    return this.http.put<IRestaurante>(`${this.resourceUrl}/${getRestauranteIdentifier(restaurante) as number}`, restaurante, {
      observe: 'response',
    });
  }

  partialUpdate(restaurante: IRestaurante): Observable<EntityResponseType> {
    return this.http.patch<IRestaurante>(`${this.resourceUrl}/${getRestauranteIdentifier(restaurante) as number}`, restaurante, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRestaurante>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRestaurante[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRestauranteToCollectionIfMissing(
    restauranteCollection: IRestaurante[],
    ...restaurantesToCheck: (IRestaurante | null | undefined)[]
  ): IRestaurante[] {
    const restaurantes: IRestaurante[] = restaurantesToCheck.filter(isPresent);
    if (restaurantes.length > 0) {
      const restauranteCollectionIdentifiers = restauranteCollection.map(restauranteItem => getRestauranteIdentifier(restauranteItem)!);
      const restaurantesToAdd = restaurantes.filter(restauranteItem => {
        const restauranteIdentifier = getRestauranteIdentifier(restauranteItem);
        if (restauranteIdentifier == null || restauranteCollectionIdentifiers.includes(restauranteIdentifier)) {
          return false;
        }
        restauranteCollectionIdentifiers.push(restauranteIdentifier);
        return true;
      });
      return [...restaurantesToAdd, ...restauranteCollection];
    }
    return restauranteCollection;
  }
}
