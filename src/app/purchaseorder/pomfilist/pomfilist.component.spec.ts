import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PomfilistComponent } from './pomfilist.component';

describe('PomfilistComponent', () => {
  let component: PomfilistComponent;
  let fixture: ComponentFixture<PomfilistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PomfilistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PomfilistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
