import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRestaurante, Restaurante } from '../restaurante.model';

import { RestauranteService } from './restaurante.service';

describe('Service Tests', () => {
  describe('Restaurante Service', () => {
    let service: RestauranteService;
    let httpMock: HttpTestingController;
    let elemDefault: IRestaurante;
    let expectedResult: IRestaurante | IRestaurante[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(RestauranteService);
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

      it('should create a Restaurante', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Restaurante()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Restaurante', () => {
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

      it('should partial update a Restaurante', () => {
        const patchObject = Object.assign({}, new Restaurante());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Restaurante', () => {
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

      it('should delete a Restaurante', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addRestauranteToCollectionIfMissing', () => {
        it('should add a Restaurante to an empty array', () => {
          const restaurante: IRestaurante = { id: 123 };
          expectedResult = service.addRestauranteToCollectionIfMissing([], restaurante);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(restaurante);
        });

        it('should not add a Restaurante to an array that contains it', () => {
          const restaurante: IRestaurante = { id: 123 };
          const restauranteCollection: IRestaurante[] = [
            {
              ...restaurante,
            },
            { id: 456 },
          ];
          expectedResult = service.addRestauranteToCollectionIfMissing(restauranteCollection, restaurante);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Restaurante to an array that doesn't contain it", () => {
          const restaurante: IRestaurante = { id: 123 };
          const restauranteCollection: IRestaurante[] = [{ id: 456 }];
          expectedResult = service.addRestauranteToCollectionIfMissing(restauranteCollection, restaurante);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(restaurante);
        });

        it('should add only unique Restaurante to an array', () => {
          const restauranteArray: IRestaurante[] = [{ id: 123 }, { id: 456 }, { id: 35459 }];
          const restauranteCollection: IRestaurante[] = [{ id: 123 }];
          expectedResult = service.addRestauranteToCollectionIfMissing(restauranteCollection, ...restauranteArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const restaurante: IRestaurante = { id: 123 };
          const restaurante2: IRestaurante = { id: 456 };
          expectedResult = service.addRestauranteToCollectionIfMissing([], restaurante, restaurante2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(restaurante);
          expect(expectedResult).toContain(restaurante2);
        });

        it('should accept null and undefined values', () => {
          const restaurante: IRestaurante = { id: 123 };
          expectedResult = service.addRestauranteToCollectionIfMissing([], null, restaurante, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(restaurante);
        });

        it('should return initial array if no Restaurante is added', () => {
          const restauranteCollection: IRestaurante[] = [{ id: 123 }];
          expectedResult = service.addRestauranteToCollectionIfMissing(restauranteCollection, undefined, null);
          expect(expectedResult).toEqual(restauranteCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
