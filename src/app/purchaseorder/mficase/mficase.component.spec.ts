import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MFICaseComponent } from './mficase.component';

describe('MFICaseComponent', () => {
  let component: MFICaseComponent;
  let fixture: ComponentFixture<MFICaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MFICaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MFICaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
