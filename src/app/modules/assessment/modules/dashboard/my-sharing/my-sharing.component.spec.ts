import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MySharingComponent } from './my-sharing.component';

describe('MySharingComponent', () => {
  let component: MySharingComponent;
  let fixture: ComponentFixture<MySharingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySharingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
