import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkDetailComponent } from './bookmark-detail.component';

describe('BookmarkDetailComponent', () => {
  let component: BookmarkDetailComponent;
  let fixture: ComponentFixture<BookmarkDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
