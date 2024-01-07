import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveSchoolsComponent } from './approve-schools.component';

describe('ApproveSchoolsComponent', () => {
  let component: ApproveSchoolsComponent;
  let fixture: ComponentFixture<ApproveSchoolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveSchoolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveSchoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
