import { TestBed } from '@angular/core/testing';

import { IncidentReport } from './incident-report';

describe('IncidentReport', () => {
  let service: IncidentReport;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentReport);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
