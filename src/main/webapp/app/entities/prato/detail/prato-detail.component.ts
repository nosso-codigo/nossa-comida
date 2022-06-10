import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPrato } from '../prato.model';

@Component({
  selector: 'jhi-prato-detail',
  templateUrl: './prato-detail.component.html',
})
export class PratoDetailComponent implements OnInit {
  prato: IPrato | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ prato }) => {
      this.prato = prato;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
