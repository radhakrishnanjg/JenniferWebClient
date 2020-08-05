import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundlistComponent } from './refundlist.component';

describe('RefundlistComponent', () => {
  let component: RefundlistComponent;
  let fixture: ComponentFixture<RefundlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
