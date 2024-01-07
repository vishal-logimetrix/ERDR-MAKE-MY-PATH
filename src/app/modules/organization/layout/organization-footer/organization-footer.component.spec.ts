import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationFooterComponent } from './organization-footer.component';

describe('OrganizationFooterComponent', () => {
  let component: OrganizationFooterComponent;
  let fixture: ComponentFixture<OrganizationFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
