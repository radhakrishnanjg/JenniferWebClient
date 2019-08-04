import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerwarehouseComponent } from './customerwarehouse.component';

describe('CustomerwarehouseComponent', () => {
  let component: CustomerwarehouseComponent;
  let fixture: ComponentFixture<CustomerwarehouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerwarehouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerwarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
