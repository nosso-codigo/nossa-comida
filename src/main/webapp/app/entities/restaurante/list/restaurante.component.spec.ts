import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RestauranteService } from '../service/restaurante.service';

import { RestauranteComponent } from './restaurante.component';

describe('Component Tests', () => {
  describe('Restaurante Management Component', () => {
    let comp: RestauranteComponent;
    let fixture: ComponentFixture<RestauranteComponent>;
    let service: RestauranteService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RestauranteComponent],
      })
        .overrideTemplate(RestauranteComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RestauranteComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(RestauranteService);

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
      expect(comp.restaurantes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
