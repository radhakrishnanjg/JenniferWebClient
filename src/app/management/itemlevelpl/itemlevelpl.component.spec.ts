import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemlevelplComponent } from './itemlevelpl.component';

describe('ItemlevelplComponent', () => {
  let component: ItemlevelplComponent;
  let fixture: ComponentFixture<ItemlevelplComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemlevelplComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemlevelplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
