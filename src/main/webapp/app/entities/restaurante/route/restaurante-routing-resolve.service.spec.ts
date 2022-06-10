jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IRestaurante, Restaurante } from '../restaurante.model';
import { RestauranteService } from '../service/restaurante.service';

import { RestauranteRoutingResolveService } from './restaurante-routing-resolve.service';

describe('Service Tests', () => {
  describe('Restaurante routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: RestauranteRoutingResolveService;
    let service: RestauranteService;
    let resultRestaurante: IRestaurante | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(RestauranteRoutingResolveService);
      service = TestBed.inject(RestauranteService);
      resultRestaurante = undefined;
    });

    describe('resolve', () => {
      it('should return IRestaurante returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRestaurante = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRestaurante).toEqual({ id: 123 });
      });

      it('should return new IRestaurante if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRestaurante = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultRestaurante).toEqual(new Restaurante());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Restaurante })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRestaurante = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRestaurante).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
