import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractTemplateList } from './contract-template-list';

describe('ContractTemplateList', () => {
  let component: ContractTemplateList;
  let fixture: ComponentFixture<ContractTemplateList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractTemplateList],
    }).compileComponents();

    fixture = TestBed.createComponent(ContractTemplateList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
