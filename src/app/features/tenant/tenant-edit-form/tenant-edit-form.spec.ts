import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantEditForm } from './tenant-edit-form';

describe('TenantEditForm', () => {
  let component: TenantEditForm;
  let fixture: ComponentFixture<TenantEditForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantEditForm],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantEditForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
