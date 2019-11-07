import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotmentlistComponent } from './allotmentlist.component';

describe('AllotmentlistComponent', () => {
  let component: AllotmentlistComponent;
  let fixture: ComponentFixture<AllotmentlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllotmentlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllotmentlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
