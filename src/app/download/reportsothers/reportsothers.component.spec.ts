import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsothersComponent } from './reportsothers.component';

describe('ReportsothersComponent', () => {
  let component: ReportsothersComponent;
  let fixture: ComponentFixture<ReportsothersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsothersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsothersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
