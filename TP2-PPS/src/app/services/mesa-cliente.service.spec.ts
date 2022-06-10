import { TestBed } from '@angular/core/testing';

import { MesaClienteService } from './mesa-cliente.service';

describe('MesaClienteService', () => {
  let service: MesaClienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MesaClienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
