import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentoutwardlistComponent } from './shipmentoutwardlist.component';

describe('ShipmentoutwardlistComponent', () => {
  let component: ShipmentoutwardlistComponent;
  let fixture: ComponentFixture<ShipmentoutwardlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentoutwardlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentoutwardlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
