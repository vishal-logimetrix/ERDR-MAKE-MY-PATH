import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostQueryComponent } from './post-query.component';

describe('PostQueryComponent', () => {
  let component: PostQueryComponent;
  let fixture: ComponentFixture<PostQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
