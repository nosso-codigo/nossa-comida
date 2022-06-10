import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RestauranteDetailComponent } from './restaurante-detail.component';

describe('Component Tests', () => {
  describe('Restaurante Management Detail Component', () => {
    let comp: RestauranteDetailComponent;
    let fixture: ComponentFixture<RestauranteDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RestauranteDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ restaurante: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(RestauranteDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RestauranteDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load restaurante on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.restaurante).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
