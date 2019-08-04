import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportmasterlistComponent } from './reportmasterlist.component';

describe('ReportmasterlistComponent', () => {
  let component: ReportmasterlistComponent;
  let fixture: ComponentFixture<ReportmasterlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportmasterlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportmasterlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
