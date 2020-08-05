import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerreceiptlistComponent } from './customerreceiptlist.component';

describe('CustomerreceiptlistComponent', () => {
  let component: CustomerreceiptlistComponent;
  let fixture: ComponentFixture<CustomerreceiptlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerreceiptlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerreceiptlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
