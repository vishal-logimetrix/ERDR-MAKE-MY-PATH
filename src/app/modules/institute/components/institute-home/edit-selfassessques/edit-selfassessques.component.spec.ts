import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSelfassessquesComponent } from './edit-selfassessques.component';

describe('EditSelfassessquesComponent', () => {
  let component: EditSelfassessquesComponent;
  let fixture: ComponentFixture<EditSelfassessquesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSelfassessquesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSelfassessquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
