import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// Components
import { MockReportListComponent } from './mock-report-list.component';

const routes: Routes = [
  { path: '', component: MockReportListComponent }
];

@NgModule({
  declarations: [
    MockReportListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MockReportListModule { }
