import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsmisComponent } from './reportsmis.component';

describe('ReportsmisComponent', () => {
  let component: ReportsmisComponent;
  let fixture: ComponentFixture<ReportsmisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsmisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsmisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
