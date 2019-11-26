import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowformlistComponent } from './workflowformlist.component';

describe('WorkflowformlistComponent', () => {
  let component: WorkflowformlistComponent;
  let fixture: ComponentFixture<WorkflowformlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowformlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowformlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
