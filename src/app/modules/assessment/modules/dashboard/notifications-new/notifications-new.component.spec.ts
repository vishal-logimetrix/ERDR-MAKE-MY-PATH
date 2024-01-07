import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsNewComponent } from './notifications-new.component';

describe('NotificationsNewComponent', () => {
  let component: NotificationsNewComponent;
  let fixture: ComponentFixture<NotificationsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
