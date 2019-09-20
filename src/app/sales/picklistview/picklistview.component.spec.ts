import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PicklistviewComponent } from './picklistview.component';

describe('PicklistviewComponent', () => {
  let component: PicklistviewComponent;
  let fixture: ComponentFixture<PicklistviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PicklistviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PicklistviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
