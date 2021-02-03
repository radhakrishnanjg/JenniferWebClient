import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAdjustmentComponent } from './financial-adjustment.component';

describe('FinancialAdjustmentComponent', () => {
  let component: FinancialAdjustmentComponent;
  let fixture: ComponentFixture<FinancialAdjustmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialAdjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
