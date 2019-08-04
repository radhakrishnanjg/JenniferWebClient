import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsstoragelistComponent } from './goodsstoragelist.component';

describe('GoodsstoragelistComponent', () => {
  let component: GoodsstoragelistComponent;
  let fixture: ComponentFixture<GoodsstoragelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsstoragelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsstoragelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
