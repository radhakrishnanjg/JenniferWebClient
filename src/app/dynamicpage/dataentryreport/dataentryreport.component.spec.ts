import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataentryreportComponent } from './dataentryreport.component';

describe('DataentryreportComponent', () => {
  let component: DataentryreportComponent;
  let fixture: ComponentFixture<DataentryreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataentryreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataentryreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
