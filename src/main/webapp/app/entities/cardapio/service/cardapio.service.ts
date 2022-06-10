import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICardapio, getCardapioIdentifier } from '../cardapio.model';

export type EntityResponseType = HttpResponse<ICardapio>;
export type EntityArrayResponseType = HttpResponse<ICardapio[]>;

@Injectable({ providedIn: 'root' })
export class CardapioService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cardapios');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(cardapio: ICardapio): Observable<EntityResponseType> {
    return this.http.post<ICardapio>(this.resourceUrl, cardapio, { observe: 'response' });
  }

  update(cardapio: ICardapio): Observable<EntityResponseType> {
    return this.http.put<ICardapio>(`${this.resourceUrl}/${getCardapioIdentifier(cardapio) as number}`, cardapio, { observe: 'response' });
  }

  partialUpdate(cardapio: ICardapio): Observable<EntityResponseType> {
    return this.http.patch<ICardapio>(`${this.resourceUrl}/${getCardapioIdentifier(cardapio) as number}`, cardapio, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICardapio>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICardapio[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCardapioToCollectionIfMissing(cardapioCollection: ICardapio[], ...cardapiosToCheck: (ICardapio | null | undefined)[]): ICardapio[] {
    const cardapios: ICardapio[] = cardapiosToCheck.filter(isPresent);
    if (cardapios.length > 0) {
      const cardapioCollectionIdentifiers = cardapioCollection.map(cardapioItem => getCardapioIdentifier(cardapioItem)!);
      const cardapiosToAdd = cardapios.filter(cardapioItem => {
        const cardapioIdentifier = getCardapioIdentifier(cardapioItem);
        if (cardapioIdentifier == null || cardapioCollectionIdentifiers.includes(cardapioIdentifier)) {
          return false;
        }
        cardapioCollectionIdentifiers.push(cardapioIdentifier);
        return true;
      });
      return [...cardapiosToAdd, ...cardapioCollection];
    }
    return cardapioCollection;
  }
}
