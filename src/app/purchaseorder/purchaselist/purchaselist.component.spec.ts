import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaselistComponent } from './purchaselist.component';

describe('PurchaselistComponent', () => {
  let component: PurchaselistComponent;
  let fixture: ComponentFixture<PurchaselistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaselistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaselistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
