import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorydetaillistComponent } from './inventorydetaillist.component';

describe('InventorydetaillistComponent', () => {
  let component: InventorydetaillistComponent;
  let fixture: ComponentFixture<InventorydetaillistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventorydetaillistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorydetaillistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
