import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPrato, getPratoIdentifier } from '../prato.model';

export type EntityResponseType = HttpResponse<IPrato>;
export type EntityArrayResponseType = HttpResponse<IPrato[]>;

@Injectable({ providedIn: 'root' })
export class PratoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pratoes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(prato: IPrato): Observable<EntityResponseType> {
    return this.http.post<IPrato>(this.resourceUrl, prato, { observe: 'response' });
  }

  update(prato: IPrato): Observable<EntityResponseType> {
    return this.http.put<IPrato>(`${this.resourceUrl}/${getPratoIdentifier(prato) as number}`, prato, { observe: 'response' });
  }

  partialUpdate(prato: IPrato): Observable<EntityResponseType> {
    return this.http.patch<IPrato>(`${this.resourceUrl}/${getPratoIdentifier(prato) as number}`, prato, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPrato>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPrato[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPratoToCollectionIfMissing(pratoCollection: IPrato[], ...pratoesToCheck: (IPrato | null | undefined)[]): IPrato[] {
    const pratoes: IPrato[] = pratoesToCheck.filter(isPresent);
    if (pratoes.length > 0) {
      const pratoCollectionIdentifiers = pratoCollection.map(pratoItem => getPratoIdentifier(pratoItem)!);
      const pratoesToAdd = pratoes.filter(pratoItem => {
        const pratoIdentifier = getPratoIdentifier(pratoItem);
        if (pratoIdentifier == null || pratoCollectionIdentifiers.includes(pratoIdentifier)) {
          return false;
        }
        pratoCollectionIdentifiers.push(pratoIdentifier);
        return true;
      });
      return [...pratoesToAdd, ...pratoCollection];
    }
    return pratoCollection;
  }
}
