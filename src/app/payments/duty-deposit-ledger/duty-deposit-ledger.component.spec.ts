import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DutyDepositLedgerComponent } from './duty-deposit-ledger.component';

describe('DutyDepositLedgerComponent', () => {
  let component: DutyDepositLedgerComponent;
  let fixture: ComponentFixture<DutyDepositLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DutyDepositLedgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DutyDepositLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
