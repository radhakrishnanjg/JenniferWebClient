import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EorsellerviewComponent } from './eorsellerview.component';

describe('EorsellerviewComponent', () => {
  let component: EorsellerviewComponent;
  let fixture: ComponentFixture<EorsellerviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EorsellerviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EorsellerviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
