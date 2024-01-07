import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkuploadStudentComponent } from './bulkupload-student.component';

describe('BulkuploadStudentComponent', () => {
  let component: BulkuploadStudentComponent;
  let fixture: ComponentFixture<BulkuploadStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkuploadStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkuploadStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
