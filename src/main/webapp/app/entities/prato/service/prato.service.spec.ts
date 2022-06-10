import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPrato, Prato } from '../prato.model';

import { PratoService } from './prato.service';

describe('Service Tests', () => {
  describe('Prato Service', () => {
    let service: PratoService;
    let httpMock: HttpTestingController;
    let elemDefault: IPrato;
    let expectedResult: IPrato | IPrato[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(PratoService);
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

      it('should create a Prato', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Prato()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Prato', () => {
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

      it('should partial update a Prato', () => {
        const patchObject = Object.assign({}, new Prato());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Prato', () => {
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

      it('should delete a Prato', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addPratoToCollectionIfMissing', () => {
        it('should add a Prato to an empty array', () => {
          const prato: IPrato = { id: 123 };
          expectedResult = service.addPratoToCollectionIfMissing([], prato);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(prato);
        });

        it('should not add a Prato to an array that contains it', () => {
          const prato: IPrato = { id: 123 };
          const pratoCollection: IPrato[] = [
            {
              ...prato,
            },
            { id: 456 },
          ];
          expectedResult = service.addPratoToCollectionIfMissing(pratoCollection, prato);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Prato to an array that doesn't contain it", () => {
          const prato: IPrato = { id: 123 };
          const pratoCollection: IPrato[] = [{ id: 456 }];
          expectedResult = service.addPratoToCollectionIfMissing(pratoCollection, prato);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(prato);
        });

        it('should add only unique Prato to an array', () => {
          const pratoArray: IPrato[] = [{ id: 123 }, { id: 456 }, { id: 79989 }];
          const pratoCollection: IPrato[] = [{ id: 123 }];
          expectedResult = service.addPratoToCollectionIfMissing(pratoCollection, ...pratoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const prato: IPrato = { id: 123 };
          const prato2: IPrato = { id: 456 };
          expectedResult = service.addPratoToCollectionIfMissing([], prato, prato2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(prato);
          expect(expectedResult).toContain(prato2);
        });

        it('should accept null and undefined values', () => {
          const prato: IPrato = { id: 123 };
          expectedResult = service.addPratoToCollectionIfMissing([], null, prato, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(prato);
        });

        it('should return initial array if no Prato is added', () => {
          const pratoCollection: IPrato[] = [{ id: 123 }];
          expectedResult = service.addPratoToCollectionIfMissing(pratoCollection, undefined, null);
          expect(expectedResult).toEqual(pratoCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
