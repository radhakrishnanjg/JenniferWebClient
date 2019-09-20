import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAmazonMTRComponent } from './report-amazon-mtr.component';

describe('ReportAmazonMTRComponent', () => {
  let component: ReportAmazonMTRComponent;
  let fixture: ComponentFixture<ReportAmazonMTRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportAmazonMTRComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAmazonMTRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
