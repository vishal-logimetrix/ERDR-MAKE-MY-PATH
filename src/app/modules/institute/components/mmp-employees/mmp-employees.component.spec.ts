import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MmpEmployeesComponent } from './mmp-employees.component';

describe('MmpEmployeesComponent', () => {
  let component: MmpEmployeesComponent;
  let fixture: ComponentFixture<MmpEmployeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MmpEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MmpEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
