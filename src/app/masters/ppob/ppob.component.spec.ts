import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpobComponent } from './ppob.component';

describe('PpobComponent', () => {
  let component: PpobComponent;
  let fixture: ComponentFixture<PpobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
