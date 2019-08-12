import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoeComponent } from './boe.component';

describe('BoeComponent', () => {
  let component: BoeComponent;
  let fixture: ComponentFixture<BoeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
