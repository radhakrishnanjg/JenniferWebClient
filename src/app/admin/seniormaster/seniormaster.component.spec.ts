import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeniormasterComponent } from './seniormaster.component';

describe('SeniormasterComponent', () => {
  let component: SeniormasterComponent;
  let fixture: ComponentFixture<SeniormasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeniormasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeniormasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
