import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoshipmentlistComponent } from './poshipmentlist.component';

describe('PoshipmentlistComponent', () => {
  let component: PoshipmentlistComponent;
  let fixture: ComponentFixture<PoshipmentlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoshipmentlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoshipmentlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
