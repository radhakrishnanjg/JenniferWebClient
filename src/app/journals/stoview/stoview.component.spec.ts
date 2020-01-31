import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoviewComponent } from './stoview.component';

describe('StoviewComponent', () => {
  let component: StoviewComponent;
  let fixture: ComponentFixture<StoviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
