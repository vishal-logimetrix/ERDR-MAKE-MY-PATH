import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStatesComponent } from './manage-states.component';

describe('ManageStatesComponent', () => {
  let component: ManageStatesComponent;
  let fixture: ComponentFixture<ManageStatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageStatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
