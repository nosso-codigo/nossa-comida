jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CardapioService } from '../service/cardapio.service';
import { ICardapio, Cardapio } from '../cardapio.model';
import { IRestaurante } from 'app/entities/restaurante/restaurante.model';
import { RestauranteService } from 'app/entities/restaurante/service/restaurante.service';

import { CardapioUpdateComponent } from './cardapio-update.component';

describe('Component Tests', () => {
  describe('Cardapio Management Update Component', () => {
    let comp: CardapioUpdateComponent;
    let fixture: ComponentFixture<CardapioUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let cardapioService: CardapioService;
    let restauranteService: RestauranteService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CardapioUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CardapioUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CardapioUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      cardapioService = TestBed.inject(CardapioService);
      restauranteService = TestBed.inject(RestauranteService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call restaurante query and add missing value', () => {
        const cardapio: ICardapio = { id: 456 };
        const restaurante: IRestaurante = { id: 81425 };
        cardapio.restaurante = restaurante;

        const restauranteCollection: IRestaurante[] = [{ id: 51822 }];
        jest.spyOn(restauranteService, 'query').mockReturnValue(of(new HttpResponse({ body: restauranteCollection })));
        const expectedCollection: IRestaurante[] = [restaurante, ...restauranteCollection];
        jest.spyOn(restauranteService, 'addRestauranteToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ cardapio });
        comp.ngOnInit();

        expect(restauranteService.query).toHaveBeenCalled();
        expect(restauranteService.addRestauranteToCollectionIfMissing).toHaveBeenCalledWith(restauranteCollection, restaurante);
        expect(comp.restaurantesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const cardapio: ICardapio = { id: 456 };
        const restaurante: IRestaurante = { id: 62468 };
        cardapio.restaurante = restaurante;

        activatedRoute.data = of({ cardapio });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(cardapio));
        expect(comp.restaurantesCollection).toContain(restaurante);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Cardapio>>();
        const cardapio = { id: 123 };
        jest.spyOn(cardapioService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ cardapio });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: cardapio }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(cardapioService.update).toHaveBeenCalledWith(cardapio);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Cardapio>>();
        const cardapio = new Cardapio();
        jest.spyOn(cardapioService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ cardapio });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: cardapio }));
        saveSubject.complete();

        // THEN
        expect(cardapioService.create).toHaveBeenCalledWith(cardapio);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Cardapio>>();
        const cardapio = { id: 123 };
        jest.spyOn(cardapioService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ cardapio });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(cardapioService.update).toHaveBeenCalledWith(cardapio);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackRestauranteById', () => {
        it('Should return tracked Restaurante primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackRestauranteById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
