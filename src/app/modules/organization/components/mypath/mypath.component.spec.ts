import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MypathComponent } from './mypath.component';

describe('MypathComponent', () => {
  let component: MypathComponent;
  let fixture: ComponentFixture<MypathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MypathComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MypathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
