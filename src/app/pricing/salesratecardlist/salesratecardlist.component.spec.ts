import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesratecardlistComponent } from './salesratecardlist.component';

describe('SalesratecardlistComponent', () => {
  let component: SalesratecardlistComponent;
  let fixture: ComponentFixture<SalesratecardlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesratecardlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesratecardlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
