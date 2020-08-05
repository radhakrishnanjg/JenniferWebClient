import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerreceiptComponent } from './customerreceipt.component';

describe('CustomerreceiptComponent', () => {
  let component: CustomerreceiptComponent;
  let fixture: ComponentFixture<CustomerreceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerreceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerreceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
