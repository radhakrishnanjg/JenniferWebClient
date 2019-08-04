import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PicklistsearchComponent } from './picklistsearch.component';

describe('PicklistsearchComponent', () => {
  let component: PicklistsearchComponent;
  let fixture: ComponentFixture<PicklistsearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PicklistsearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PicklistsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
