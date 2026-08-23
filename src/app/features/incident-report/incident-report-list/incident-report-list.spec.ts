import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentReportList } from './incident-report-list';

describe('IncidentReportList', () => {
  let component: IncidentReportList;
  let fixture: ComponentFixture<IncidentReportList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentReportList],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentReportList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
