import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpnavigationComponent } from './helpnavigation.component';

describe('HelpnavigationComponent', () => {
  let component: HelpnavigationComponent;
  let fixture: ComponentFixture<HelpnavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpnavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpnavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
