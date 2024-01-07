import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationNavComponent } from './organization-nav.component';

describe('OrganizationNavComponent', () => {
  let component: OrganizationNavComponent;
  let fixture: ComponentFixture<OrganizationNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
