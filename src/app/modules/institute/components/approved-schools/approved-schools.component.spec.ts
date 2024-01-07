import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedSchoolsComponent } from './approved-schools.component';

describe('ApprovedSchoolsComponent', () => {
  let component: ApprovedSchoolsComponent;
  let fixture: ComponentFixture<ApprovedSchoolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovedSchoolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedSchoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
