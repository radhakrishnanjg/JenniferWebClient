import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerreceiptviewComponent } from './customerreceiptview.component';

describe('CustomerreceiptviewComponent', () => {
  let component: CustomerreceiptviewComponent;
  let fixture: ComponentFixture<CustomerreceiptviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerreceiptviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerreceiptviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
