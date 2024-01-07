import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignCourseComponent } from './design-course.component';

describe('DesignCourseComponent', () => {
  let component: DesignCourseComponent;
  let fixture: ComponentFixture<DesignCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
