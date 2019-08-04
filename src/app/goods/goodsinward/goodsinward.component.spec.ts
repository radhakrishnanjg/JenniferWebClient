import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsinwardComponent } from './goodsinward.component';

describe('GoodsinwardComponent', () => {
  let component: GoodsinwardComponent;
  let fixture: ComponentFixture<GoodsinwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsinwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsinwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
