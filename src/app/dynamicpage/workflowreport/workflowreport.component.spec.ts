import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowreportComponent } from './workflowreport.component';

describe('WorkflowreportComponent', () => {
  let component: WorkflowreportComponent;
  let fixture: ComponentFixture<WorkflowreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
