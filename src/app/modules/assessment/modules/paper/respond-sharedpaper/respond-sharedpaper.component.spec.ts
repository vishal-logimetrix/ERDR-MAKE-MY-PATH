import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RespondSharedpaperComponent } from './respond-sharedpaper.component';

describe('RespondSharedpaperComponent', () => {
  let component: RespondSharedpaperComponent;
  let fixture: ComponentFixture<RespondSharedpaperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RespondSharedpaperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RespondSharedpaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
