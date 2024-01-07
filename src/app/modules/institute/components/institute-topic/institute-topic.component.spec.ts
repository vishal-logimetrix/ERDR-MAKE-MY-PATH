import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteTopicComponent } from './institute-topic.component';

describe('InstituteTopicComponent', () => {
  let component: InstituteTopicComponent;
  let fixture: ComponentFixture<InstituteTopicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstituteTopicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstituteTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
