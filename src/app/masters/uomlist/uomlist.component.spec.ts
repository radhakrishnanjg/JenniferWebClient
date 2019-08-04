import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UomlistComponent } from './uomlist.component';

describe('UomlistComponent', () => {
  let component: UomlistComponent;
  let fixture: ComponentFixture<UomlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UomlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UomlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
