import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventmanagerComponent } from './eventmanager.component';

describe('EventmanagerComponent', () => {
  let component: EventmanagerComponent;
  let fixture: ComponentFixture<EventmanagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventmanagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventmanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
