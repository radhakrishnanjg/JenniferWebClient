import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataentryformComponent } from './dataentryform.component';

describe('DataentryformComponent', () => {
  let component: DataentryformComponent;
  let fixture: ComponentFixture<DataentryformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataentryformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataentryformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
