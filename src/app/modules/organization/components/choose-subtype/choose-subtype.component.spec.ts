import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseSubtypeComponent } from './choose-subtype.component';

describe('ChooseSubtypeComponent', () => {
  let component: ChooseSubtypeComponent;
  let fixture: ComponentFixture<ChooseSubtypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseSubtypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseSubtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
