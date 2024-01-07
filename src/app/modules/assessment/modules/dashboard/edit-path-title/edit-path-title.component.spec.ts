import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPathTitleComponent } from './edit-path-title.component';

describe('EditPathTitleComponent', () => {
  let component: EditPathTitleComponent;
  let fixture: ComponentFixture<EditPathTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPathTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPathTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
