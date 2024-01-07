import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContactUsHomeComponent } from './contact-us-home.component'


const routes: Routes = [
  { path: '', component: ContactUsHomeComponent },
];

@NgModule({
  declarations: [
    ContactUsHomeComponent
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
export class ContactUsHomeModule { }
