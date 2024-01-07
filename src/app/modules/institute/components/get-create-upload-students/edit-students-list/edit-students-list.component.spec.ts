import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStudentsListComponent } from './edit-students-list.component';

describe('EditStudentsListComponent', () => {
  let component: EditStudentsListComponent;
  let fixture: ComponentFixture<EditStudentsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditStudentsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStudentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
