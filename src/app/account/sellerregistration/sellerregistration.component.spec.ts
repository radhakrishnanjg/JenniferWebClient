import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerregistrationComponent } from './sellerregistration.component';

describe('SellerregistrationComponent', () => {
  let component: SellerregistrationComponent;
  let fixture: ComponentFixture<SellerregistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerregistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerregistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
