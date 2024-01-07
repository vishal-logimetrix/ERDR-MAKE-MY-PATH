import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RespondPaperSharingComponent } from './respond-paper-sharing.component';

describe('RespondPaperSharingComponent', () => {
  let component: RespondPaperSharingComponent;
  let fixture: ComponentFixture<RespondPaperSharingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RespondPaperSharingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RespondPaperSharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
