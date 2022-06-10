import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICardapio, Cardapio } from '../cardapio.model';

import { CardapioService } from './cardapio.service';

describe('Service Tests', () => {
  describe('Cardapio Service', () => {
    let service: CardapioService;
    let httpMock: HttpTestingController;
    let elemDefault: ICardapio;
    let expectedResult: ICardapio | ICardapio[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CardapioService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        nome: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Cardapio', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Cardapio()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Cardapio', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Cardapio', () => {
        const patchObject = Object.assign({}, new Cardapio());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Cardapio', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Cardapio', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCardapioToCollectionIfMissing', () => {
        it('should add a Cardapio to an empty array', () => {
          const cardapio: ICardapio = { id: 123 };
          expectedResult = service.addCardapioToCollectionIfMissing([], cardapio);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(cardapio);
        });

        it('should not add a Cardapio to an array that contains it', () => {
          const cardapio: ICardapio = { id: 123 };
          const cardapioCollection: ICardapio[] = [
            {
              ...cardapio,
            },
            { id: 456 },
          ];
          expectedResult = service.addCardapioToCollectionIfMissing(cardapioCollection, cardapio);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Cardapio to an array that doesn't contain it", () => {
          const cardapio: ICardapio = { id: 123 };
          const cardapioCollection: ICardapio[] = [{ id: 456 }];
          expectedResult = service.addCardapioToCollectionIfMissing(cardapioCollection, cardapio);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(cardapio);
        });

        it('should add only unique Cardapio to an array', () => {
          const cardapioArray: ICardapio[] = [{ id: 123 }, { id: 456 }, { id: 17100 }];
          const cardapioCollection: ICardapio[] = [{ id: 123 }];
          expectedResult = service.addCardapioToCollectionIfMissing(cardapioCollection, ...cardapioArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const cardapio: ICardapio = { id: 123 };
          const cardapio2: ICardapio = { id: 456 };
          expectedResult = service.addCardapioToCollectionIfMissing([], cardapio, cardapio2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(cardapio);
          expect(expectedResult).toContain(cardapio2);
        });

        it('should accept null and undefined values', () => {
          const cardapio: ICardapio = { id: 123 };
          expectedResult = service.addCardapioToCollectionIfMissing([], null, cardapio, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(cardapio);
        });

        it('should return initial array if no Cardapio is added', () => {
          const cardapioCollection: ICardapio[] = [{ id: 123 }];
          expectedResult = service.addCardapioToCollectionIfMissing(cardapioCollection, undefined, null);
          expect(expectedResult).toEqual(cardapioCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
