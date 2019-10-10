import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpmenulistComponent } from './helpmenulist.component';

describe('HelpmenulistComponent', () => {
  let component: HelpmenulistComponent;
  let fixture: ComponentFixture<HelpmenulistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpmenulistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpmenulistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
