import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstapprovalComponent } from './gstapproval.component';

describe('GstapprovalComponent', () => {
  let component: GstapprovalComponent;
  let fixture: ComponentFixture<GstapprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstapprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
