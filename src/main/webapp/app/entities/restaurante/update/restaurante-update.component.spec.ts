jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RestauranteService } from '../service/restaurante.service';
import { IRestaurante, Restaurante } from '../restaurante.model';
import { IEndereco } from 'app/entities/endereco/endereco.model';
import { EnderecoService } from 'app/entities/endereco/service/endereco.service';

import { RestauranteUpdateComponent } from './restaurante-update.component';

describe('Component Tests', () => {
  describe('Restaurante Management Update Component', () => {
    let comp: RestauranteUpdateComponent;
    let fixture: ComponentFixture<RestauranteUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let restauranteService: RestauranteService;
    let enderecoService: EnderecoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RestauranteUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(RestauranteUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RestauranteUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      restauranteService = TestBed.inject(RestauranteService);
      enderecoService = TestBed.inject(EnderecoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call endereco query and add missing value', () => {
        const restaurante: IRestaurante = { id: 456 };
        const endereco: IEndereco = { id: 35317 };
        restaurante.endereco = endereco;

        const enderecoCollection: IEndereco[] = [{ id: 40064 }];
        jest.spyOn(enderecoService, 'query').mockReturnValue(of(new HttpResponse({ body: enderecoCollection })));
        const expectedCollection: IEndereco[] = [endereco, ...enderecoCollection];
        jest.spyOn(enderecoService, 'addEnderecoToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ restaurante });
        comp.ngOnInit();

        expect(enderecoService.query).toHaveBeenCalled();
        expect(enderecoService.addEnderecoToCollectionIfMissing).toHaveBeenCalledWith(enderecoCollection, endereco);
        expect(comp.enderecosCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const restaurante: IRestaurante = { id: 456 };
        const endereco: IEndereco = { id: 24611 };
        restaurante.endereco = endereco;

        activatedRoute.data = of({ restaurante });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(restaurante));
        expect(comp.enderecosCollection).toContain(endereco);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Restaurante>>();
        const restaurante = { id: 123 };
        jest.spyOn(restauranteService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ restaurante });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: restaurante }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(restauranteService.update).toHaveBeenCalledWith(restaurante);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Restaurante>>();
        const restaurante = new Restaurante();
        jest.spyOn(restauranteService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ restaurante });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: restaurante }));
        saveSubject.complete();

        // THEN
        expect(restauranteService.create).toHaveBeenCalledWith(restaurante);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Restaurante>>();
        const restaurante = { id: 123 };
        jest.spyOn(restauranteService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ restaurante });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(restauranteService.update).toHaveBeenCalledWith(restaurante);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackEnderecoById', () => {
        it('Should return tracked Endereco primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackEnderecoById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
