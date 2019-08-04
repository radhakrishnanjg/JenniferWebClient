import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountlistComponent } from './discountlist.component';

describe('DiscountlistComponent', () => {
  let component: DiscountlistComponent;
  let fixture: ComponentFixture<DiscountlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
