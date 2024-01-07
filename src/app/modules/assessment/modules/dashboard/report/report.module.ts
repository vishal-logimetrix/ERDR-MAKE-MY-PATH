import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// Components
import { ReportComponent } from './report.component';
import { PaperTypeComponent } from './paper-type/paper-type.component';


const routes: Routes = [
  {
    path: '', component: ReportComponent,
    children: [
      { path: '', component: PaperTypeComponent },
      {
        path: 'practice-test-report',
        loadChildren: () => import('./mock-report-list/mock-report-list.module')
          .then(m => m.MockReportListModule)
      },
      {
        path: 'assessment-test-report',
        loadChildren: () => import('./assessment-report-list/assessment-report-list.module')
          .then(m => m.AssessmentReportListModule)
      },
      {
        path: 'test-report/:type/:id/:attemptOrder',
        loadChildren: () => import('./report-detail/report-detail.module')
          .then(m => m.ReportDetailModule)
      },
    ]
  },
];

@NgModule({
  declarations: [
    ReportComponent,
    PaperTypeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ReportModule { }
