import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';


// Components
import { ChangePasswordComponent } from './change-password.component';

const routes: Routes = [
  { path: '', component: ChangePasswordComponent }
];

@NgModule({
  declarations: [
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,

    FormsModule,
    ReactiveFormsModule,

    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ChangePasswordModule { }
