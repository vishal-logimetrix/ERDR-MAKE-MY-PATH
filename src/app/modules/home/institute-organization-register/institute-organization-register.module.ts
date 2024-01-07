import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstituteOrganizationRegisterComponent } from './institute-organization-register.component';
import { InstituteRegisterComponent } from './components/institute-register/institute-register.component';
import { OrganizationRegisterComponent } from './components/organization-register/organization-register.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
  {
    path: '', component: InstituteOrganizationRegisterComponent,
    children: [
      { path: 'institute', component: InstituteRegisterComponent },
      { path: 'organization', component: OrganizationRegisterComponent },
    ]
  },
];



@NgModule({
  declarations: [
    InstituteOrganizationRegisterComponent,
    InstituteRegisterComponent,
    OrganizationRegisterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class InstituteOrganizationRegisterModule { }
