import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesorderapprovallistComponent } from './salesorderapprovallist.component';

describe('SalesorderapprovallistComponent', () => {
  let component: SalesorderapprovallistComponent;
  let fixture: ComponentFixture<SalesorderapprovallistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesorderapprovallistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesorderapprovallistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
