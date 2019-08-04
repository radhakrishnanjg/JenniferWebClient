import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsinwardlistComponent } from './goodsinwardlist.component';

describe('GoodsinwardlistComponent', () => {
  let component: GoodsinwardlistComponent;
  let fixture: ComponentFixture<GoodsinwardlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsinwardlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsinwardlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
