import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerwarehouselistComponent } from './customerwarehouselist.component';

describe('CustomerwarehouselistComponent', () => {
  let component: CustomerwarehouselistComponent;
  let fixture: ComponentFixture<CustomerwarehouselistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerwarehouselistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerwarehouselistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
