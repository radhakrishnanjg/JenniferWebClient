import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsstorageComponent } from './goodsstorage.component';

describe('GoodsstorageComponent', () => {
  let component: GoodsstorageComponent;
  let fixture: ComponentFixture<GoodsstorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsstorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsstorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
