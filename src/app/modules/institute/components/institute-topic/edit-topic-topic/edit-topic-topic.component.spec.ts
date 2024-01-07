import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTopicTopicComponent } from './edit-topic-topic.component';

describe('EditTopicTopicComponent', () => {
  let component: EditTopicTopicComponent;
  let fixture: ComponentFixture<EditTopicTopicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTopicTopicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTopicTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
