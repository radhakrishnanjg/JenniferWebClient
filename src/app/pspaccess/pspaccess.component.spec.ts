import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PspaccessComponent } from './pspaccess.component';

describe('PspaccessComponent', () => {
  let component: PspaccessComponent;
  let fixture: ComponentFixture<PspaccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PspaccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PspaccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
