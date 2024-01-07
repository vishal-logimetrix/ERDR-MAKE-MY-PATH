import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// 3rd Party Services
import { CookieService } from 'ngx-cookie-service';

// Components
import { VerifyPhoneComponent } from './verify-phone.component';

describe('VerifyPhoneComponent', () => {
  let component: VerifyPhoneComponent;
  let fixture: ComponentFixture<VerifyPhoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [
        VerifyPhoneComponent
      ],
      providers: [
        CookieService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
