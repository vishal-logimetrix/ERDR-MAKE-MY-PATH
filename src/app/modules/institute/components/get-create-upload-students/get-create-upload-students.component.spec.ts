import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetCreateUploadStudentsComponent } from './get-create-upload-students.component';

describe('GetCreateUploadStudentsComponent', () => {
  let component: GetCreateUploadStudentsComponent;
  let fixture: ComponentFixture<GetCreateUploadStudentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetCreateUploadStudentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetCreateUploadStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
