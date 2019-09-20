import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportscomplianceComponent } from './reportscompliance.component';

describe('ReportscomplianceComponent', () => {
  let component: ReportscomplianceComponent;
  let fixture: ComponentFixture<ReportscomplianceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportscomplianceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportscomplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
