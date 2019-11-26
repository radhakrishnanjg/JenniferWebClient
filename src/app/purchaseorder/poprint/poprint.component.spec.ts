import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoprintComponent } from './poprint.component';

describe('PoprintComponent', () => {
  let component: PoprintComponent;
  let fixture: ComponentFixture<PoprintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoprintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
