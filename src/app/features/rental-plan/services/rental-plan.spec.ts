import { TestBed } from '@angular/core/testing';

import { RentalPlan } from './rental-plan';

describe('RentalPlan', () => {
  let service: RentalPlan;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RentalPlan);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
