import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalPlanList } from './rental-plan-list';

describe('RentalPlanList', () => {
  let component: RentalPlanList;
  let fixture: ComponentFixture<RentalPlanList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalPlanList],
    }).compileComponents();

    fixture = TestBed.createComponent(RentalPlanList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
