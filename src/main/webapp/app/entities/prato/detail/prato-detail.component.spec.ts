import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PratoDetailComponent } from './prato-detail.component';

describe('Component Tests', () => {
  describe('Prato Management Detail Component', () => {
    let comp: PratoDetailComponent;
    let fixture: ComponentFixture<PratoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PratoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ prato: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(PratoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PratoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load prato on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.prato).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
