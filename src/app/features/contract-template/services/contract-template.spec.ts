import { TestBed } from '@angular/core/testing';

import { ContractTemplate } from './contract-template';

describe('ContractTemplate', () => {
  let service: ContractTemplate;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractTemplate);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
