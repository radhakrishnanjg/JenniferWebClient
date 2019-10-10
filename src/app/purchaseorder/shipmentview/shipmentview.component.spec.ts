import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentviewComponent } from './shipmentview.component';

describe('ShipmentviewComponent', () => {
  let component: ShipmentviewComponent;
  let fixture: ComponentFixture<ShipmentviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
