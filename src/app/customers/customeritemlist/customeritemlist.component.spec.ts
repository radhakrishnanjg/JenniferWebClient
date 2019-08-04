import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomeritemlistComponent } from './customeritemlist.component';

describe('CustomeritemlistComponent', () => {
  let component: CustomeritemlistComponent;
  let fixture: ComponentFixture<CustomeritemlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomeritemlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomeritemlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
