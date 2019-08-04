import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoviewComponent } from './poview.component';

describe('PoviewComponent', () => {
  let component: PoviewComponent;
  let fixture: ComponentFixture<PoviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
