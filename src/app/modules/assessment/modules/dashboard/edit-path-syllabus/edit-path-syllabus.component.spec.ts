import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPathSyllabusComponent } from './edit-path-syllabus.component';

describe('EditPathSyllabusComponent', () => {
  let component: EditPathSyllabusComponent;
  let fixture: ComponentFixture<EditPathSyllabusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPathSyllabusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPathSyllabusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
