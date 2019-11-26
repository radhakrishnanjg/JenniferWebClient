import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataentryformlistComponent } from './dataentryformlist.component';

describe('DataentryformlistComponent', () => {
  let component: DataentryformlistComponent;
  let fixture: ComponentFixture<DataentryformlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataentryformlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataentryformlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
