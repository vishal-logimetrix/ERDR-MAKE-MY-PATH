import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// Components
import { AssessmentReportListComponent } from './assessment-report-list.component';

const routes: Routes = [
  { path: '', component: AssessmentReportListComponent }
];

@NgModule({
  declarations: [
    AssessmentReportListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AssessmentReportListModule { }
