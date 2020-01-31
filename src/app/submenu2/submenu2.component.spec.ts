import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Submenu2Component } from './submenu2.component';

describe('Submenu2Component', () => {
  let component: Submenu2Component;
  let fixture: ComponentFixture<Submenu2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Submenu2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Submenu2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
