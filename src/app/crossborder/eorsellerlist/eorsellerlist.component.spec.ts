import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EorsellerlistComponent } from './eorsellerlist.component';

describe('EorsellerlistComponent', () => {
  let component: EorsellerlistComponent;
  let fixture: ComponentFixture<EorsellerlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EorsellerlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EorsellerlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
