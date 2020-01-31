import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitnoteComponent } from './debitnote.component';

describe('DebitnoteComponent', () => {
  let component: DebitnoteComponent;
  let fixture: ComponentFixture<DebitnoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebitnoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebitnoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
