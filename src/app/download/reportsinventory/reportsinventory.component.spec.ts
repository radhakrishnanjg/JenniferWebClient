import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsinventoryComponent } from './reportsinventory.component';

describe('ReportsinventoryComponent', () => {
  let component: ReportsinventoryComponent;
  let fixture: ComponentFixture<ReportsinventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsinventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsinventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
