import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentReportForm } from './incident-report-form';

describe('IncidentReportForm', () => {
  let component: IncidentReportForm;
  let fixture: ComponentFixture<IncidentReportForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentReportForm],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentReportForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
