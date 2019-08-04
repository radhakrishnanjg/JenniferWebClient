import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesorderapprovalComponent } from './salesorderapproval.component';

describe('SalesorderapprovalComponent', () => {
  let component: SalesorderapprovalComponent;
  let fixture: ComponentFixture<SalesorderapprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesorderapprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesorderapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
