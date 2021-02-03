import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesorderunsellableDisputeComponent } from './salesorderunsellable-dispute.component';

describe('SalesorderunsellableDisputeComponent', () => {
  let component: SalesorderunsellableDisputeComponent;
  let fixture: ComponentFixture<SalesorderunsellableDisputeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesorderunsellableDisputeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesorderunsellableDisputeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
