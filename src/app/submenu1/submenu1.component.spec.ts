import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Submenu1Component } from './submenu1.component';

describe('Submenu1Component', () => {
  let component: Submenu1Component;
  let fixture: ComponentFixture<Submenu1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Submenu1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Submenu1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
