import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportmasterComponent } from './reportmaster.component';

describe('ReportmasterComponent', () => {
  let component: ReportmasterComponent;
  let fixture: ComponentFixture<ReportmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
