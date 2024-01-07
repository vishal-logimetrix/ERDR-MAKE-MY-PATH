import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { AppBootStrapModule } from '../../bootstrap-module';

// Components
import { HomeComponent } from './home.component';
import { HomepageComponent } from './homepage/homepage.component';

import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';

import { LoginComponent } from '../../components/login/login.component';
import { RegisterComponent } from '../../components/register/register.component';
import { VerifyPhoneComponent } from '../../components/verify-phone/verify-phone.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

// Directives
import { NavbarDirective } from '../../directives/navbar.directive';
import { TempLoginComponent } from './temp-login/temp-login.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { FooterWebsiteComponent } from './footer-website/footer-website.component';
import { NavbarWebsiteComponent } from './navbar-website/navbar-website.component';
import { SchoolSignupComponent } from './school-signup/school-signup.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: '', component: HomepageComponent },
      { path: 'about-us', component: AboutUsComponent},
      { path: 'privacy-policy', component: PrivacyPolicyComponent},
      { path: 'page/:name', loadChildren: () => import('./flat-page/flat-page.module').then(m => m.FlatPageModule), },
      { path: 'contact-us', loadChildren: () => import('./contact-us-home/contact-us-home.module').then(m => m.ContactUsHomeModule), },
      { path: 'blogs', loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule), },
      { path: 'register', loadChildren: () => import('./institute-organization-register/institute-organization-register.module').then(m => m.InstituteOrganizationRegisterModule), 
    },
      {
        path: 'donotloginhere', component: TempLoginComponent,
      },
      {
        path: 'school-signup', component: SchoolSignupComponent,
      },
    ]
  },
];


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    VerifyPhoneComponent,
    ForgotPasswordComponent,

    FooterComponent,
    NavbarComponent,

    HomeComponent,
    HomepageComponent,

    // Directives
    NavbarDirective,

    TempLoginComponent,

    AboutUsComponent,

    FooterWebsiteComponent,

    NavbarWebsiteComponent,

    SchoolSignupComponent,

    PrivacyPolicyComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppBootStrapModule,
    RouterModule.forChild(routes),
  ]
})
export class HomeModule {
}
