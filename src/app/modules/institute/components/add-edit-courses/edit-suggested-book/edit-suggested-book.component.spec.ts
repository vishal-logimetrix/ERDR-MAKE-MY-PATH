import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSuggestedBookComponent } from './edit-suggested-book.component';

describe('EditSuggestedBookComponent', () => {
  let component: EditSuggestedBookComponent;
  let fixture: ComponentFixture<EditSuggestedBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSuggestedBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSuggestedBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
