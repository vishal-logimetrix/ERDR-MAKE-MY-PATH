import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkuploadSchoolComponent } from './bulkupload-school.component';

describe('BulkuploadSchoolComponent', () => {
  let component: BulkuploadSchoolComponent;
  let fixture: ComponentFixture<BulkuploadSchoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkuploadSchoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkuploadSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
