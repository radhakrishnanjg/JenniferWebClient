import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoeviewComponent } from './boeview.component';

describe('BoeviewComponent', () => {
  let component: BoeviewComponent;
  let fixture: ComponentFixture<BoeviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoeviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
