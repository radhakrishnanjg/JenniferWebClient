import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitnoteviewComponent } from './debitnoteview.component';

describe('DebitnoteviewComponent', () => {
  let component: DebitnoteviewComponent;
  let fixture: ComponentFixture<DebitnoteviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebitnoteviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebitnoteviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
