import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

// Components
import { ContactUsComponent } from './contact-us.component';

const routes: Routes = [
  { path: '', component: ContactUsComponent }
];

@NgModule({
  declarations: [
    ContactUsComponent
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
export class ContactUsModule { }
