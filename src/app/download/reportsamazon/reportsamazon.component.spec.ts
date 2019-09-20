import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsamazonComponent } from './reportsamazon.component';

describe('ReportsamazonComponent', () => {
  let component: ReportsamazonComponent;
  let fixture: ComponentFixture<ReportsamazonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsamazonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsamazonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
