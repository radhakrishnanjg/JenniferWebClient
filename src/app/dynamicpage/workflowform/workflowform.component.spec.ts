import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowformComponent } from './workflowform.component';

describe('WorkflowformComponent', () => {
  let component: WorkflowformComponent;
  let fixture: ComponentFixture<WorkflowformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
