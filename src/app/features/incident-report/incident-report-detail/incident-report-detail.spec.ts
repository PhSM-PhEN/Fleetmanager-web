import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentReportDetail } from './incident-report-detail';

describe('IncidentReportDetail', () => {
  let component: IncidentReportDetail;
  let fixture: ComponentFixture<IncidentReportDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentReportDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentReportDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
