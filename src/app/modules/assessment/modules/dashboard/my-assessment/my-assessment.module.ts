import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

// Components
import { MyAssessmentComponent } from './my-assessment.component';

const routes: Routes = [
  { path: '', component: MyAssessmentComponent }
];

@NgModule({
  declarations: [
    MyAssessmentComponent
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
export class MyAssessmentModule { }
