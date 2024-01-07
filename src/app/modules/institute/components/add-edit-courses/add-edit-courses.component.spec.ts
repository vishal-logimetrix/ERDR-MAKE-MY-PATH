import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCoursesComponent } from './add-edit-courses.component';

describe('AddEditCoursesComponent', () => {
  let component: AddEditCoursesComponent;
  let fixture: ComponentFixture<AddEditCoursesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditCoursesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
