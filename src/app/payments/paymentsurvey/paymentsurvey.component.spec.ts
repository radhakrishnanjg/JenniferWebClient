import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsurveyComponent } from './paymentsurvey.component';

describe('PaymentsurveyComponent', () => {
  let component: PaymentsurveyComponent;
  let fixture: ComponentFixture<PaymentsurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
