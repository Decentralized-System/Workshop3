import { TestBed } from '@angular/core/testing';

import { HttpFacadeService } from './http-facade.service';

describe('HttpFacadeService', () => {
  let service: HttpFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
