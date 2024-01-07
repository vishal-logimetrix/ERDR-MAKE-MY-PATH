import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBulkNotificationsComponent } from './create-bulk-notifications.component';

describe('CreateBulkNotificationsComponent', () => {
  let component: CreateBulkNotificationsComponent;
  let fixture: ComponentFixture<CreateBulkNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBulkNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBulkNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
