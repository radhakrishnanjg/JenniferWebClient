import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoelistComponent } from './boelist.component';

describe('BoelistComponent', () => {
  let component: BoelistComponent;
  let fixture: ComponentFixture<BoelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
