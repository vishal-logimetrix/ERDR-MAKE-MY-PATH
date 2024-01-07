import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteOrganizationRegisterComponent } from './institute-organization-register.component';

describe('InstituteOrganizationRegisterComponent', () => {
  let component: InstituteOrganizationRegisterComponent;
  let fixture: ComponentFixture<InstituteOrganizationRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstituteOrganizationRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstituteOrganizationRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
