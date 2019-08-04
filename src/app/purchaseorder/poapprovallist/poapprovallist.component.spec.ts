import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoapprovallistComponent } from './poapprovallist.component';

describe('PoapprovallistComponent', () => {
  let component: PoapprovallistComponent;
  let fixture: ComponentFixture<PoapprovallistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoapprovallistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoapprovallistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
