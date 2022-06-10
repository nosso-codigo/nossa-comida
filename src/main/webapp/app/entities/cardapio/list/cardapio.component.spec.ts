import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CardapioService } from '../service/cardapio.service';

import { CardapioComponent } from './cardapio.component';

describe('Component Tests', () => {
  describe('Cardapio Management Component', () => {
    let comp: CardapioComponent;
    let fixture: ComponentFixture<CardapioComponent>;
    let service: CardapioService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CardapioComponent],
      })
        .overrideTemplate(CardapioComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CardapioComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(CardapioService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.cardapios?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
