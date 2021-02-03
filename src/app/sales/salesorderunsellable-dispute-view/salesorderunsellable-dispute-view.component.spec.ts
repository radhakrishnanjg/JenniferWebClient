import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesorderunsellableDisputeViewComponent } from './salesorderunsellable-dispute-view.component';

describe('SalesorderunsellableDisputeViewComponent', () => {
  let component: SalesorderunsellableDisputeViewComponent;
  let fixture: ComponentFixture<SalesorderunsellableDisputeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesorderunsellableDisputeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesorderunsellableDisputeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
