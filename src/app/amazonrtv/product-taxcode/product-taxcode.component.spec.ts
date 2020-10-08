import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTaxcodeComponent } from './product-taxcode.component';

describe('ProductTaxcodeComponent', () => {
  let component: ProductTaxcodeComponent;
  let fixture: ComponentFixture<ProductTaxcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductTaxcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTaxcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
