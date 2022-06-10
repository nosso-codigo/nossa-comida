import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PratoService } from '../service/prato.service';

import { PratoComponent } from './prato.component';

describe('Component Tests', () => {
  describe('Prato Management Component', () => {
    let comp: PratoComponent;
    let fixture: ComponentFixture<PratoComponent>;
    let service: PratoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PratoComponent],
      })
        .overrideTemplate(PratoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PratoComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(PratoService);

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
      expect(comp.pratoes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
