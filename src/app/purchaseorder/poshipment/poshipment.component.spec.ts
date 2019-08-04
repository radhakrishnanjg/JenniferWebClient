import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoshipmentComponent } from './poshipment.component';

describe('PoshipmentComponent', () => {
  let component: PoshipmentComponent;
  let fixture: ComponentFixture<PoshipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoshipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoshipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
