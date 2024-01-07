import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPreviousPaperComponent } from './edit-previous-paper.component';

describe('EditPreviousPaperComponent', () => {
  let component: EditPreviousPaperComponent;
  let fixture: ComponentFixture<EditPreviousPaperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPreviousPaperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPreviousPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
