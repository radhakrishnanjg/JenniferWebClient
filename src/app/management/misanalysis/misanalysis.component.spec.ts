import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MISanalysisComponent } from './misanalysis.component';

describe('MISanalysisComponent', () => {
  let component: MISanalysisComponent;
  let fixture: ComponentFixture<MISanalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MISanalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MISanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
