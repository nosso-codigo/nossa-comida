import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CardapioDetailComponent } from './cardapio-detail.component';

describe('Component Tests', () => {
  describe('Cardapio Management Detail Component', () => {
    let comp: CardapioDetailComponent;
    let fixture: ComponentFixture<CardapioDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CardapioDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ cardapio: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(CardapioDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CardapioDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load cardapio on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.cardapio).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
