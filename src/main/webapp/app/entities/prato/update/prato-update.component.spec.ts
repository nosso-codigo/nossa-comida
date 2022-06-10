jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PratoService } from '../service/prato.service';
import { IPrato, Prato } from '../prato.model';
import { ICardapio } from 'app/entities/cardapio/cardapio.model';
import { CardapioService } from 'app/entities/cardapio/service/cardapio.service';

import { PratoUpdateComponent } from './prato-update.component';

describe('Component Tests', () => {
  describe('Prato Management Update Component', () => {
    let comp: PratoUpdateComponent;
    let fixture: ComponentFixture<PratoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let pratoService: PratoService;
    let cardapioService: CardapioService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PratoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PratoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PratoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      pratoService = TestBed.inject(PratoService);
      cardapioService = TestBed.inject(CardapioService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Cardapio query and add missing value', () => {
        const prato: IPrato = { id: 456 };
        const cardapio: ICardapio = { id: 18239 };
        prato.cardapio = cardapio;

        const cardapioCollection: ICardapio[] = [{ id: 89113 }];
        jest.spyOn(cardapioService, 'query').mockReturnValue(of(new HttpResponse({ body: cardapioCollection })));
        const additionalCardapios = [cardapio];
        const expectedCollection: ICardapio[] = [...additionalCardapios, ...cardapioCollection];
        jest.spyOn(cardapioService, 'addCardapioToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ prato });
        comp.ngOnInit();

        expect(cardapioService.query).toHaveBeenCalled();
        expect(cardapioService.addCardapioToCollectionIfMissing).toHaveBeenCalledWith(cardapioCollection, ...additionalCardapios);
        expect(comp.cardapiosSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const prato: IPrato = { id: 456 };
        const cardapio: ICardapio = { id: 32229 };
        prato.cardapio = cardapio;

        activatedRoute.data = of({ prato });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(prato));
        expect(comp.cardapiosSharedCollection).toContain(cardapio);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Prato>>();
        const prato = { id: 123 };
        jest.spyOn(pratoService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ prato });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: prato }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(pratoService.update).toHaveBeenCalledWith(prato);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Prato>>();
        const prato = new Prato();
        jest.spyOn(pratoService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ prato });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: prato }));
        saveSubject.complete();

        // THEN
        expect(pratoService.create).toHaveBeenCalledWith(prato);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Prato>>();
        const prato = { id: 123 };
        jest.spyOn(pratoService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ prato });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(pratoService.update).toHaveBeenCalledWith(prato);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCardapioById', () => {
        it('Should return tracked Cardapio primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCardapioById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
