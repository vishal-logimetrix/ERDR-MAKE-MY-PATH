import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// Custom Modules
import { ChartModule } from 'angular-highcharts';
import { AppBootStrapModule } from '../../../../../../bootstrap-module';
import { PipeListModule } from '../../../../../../shared/modules/pipe-list.module';

// Components
import { ReportDetailComponent } from './report-detail.component';
import { ChapterWiseComponent } from './chapter-wise/chapter-wise.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { PercentileComponent } from './percentile/percentile.component';
import { AttemptedCorrectedComponent } from './attempted-corrected/attempted-corrected.component';
import { ComparisonComponent } from './comparison/comparison.component';

const routes: Routes = [
  { path: '', component: ReportDetailComponent }
];

@NgModule({
  declarations: [
    ReportDetailComponent,
    ChapterWiseComponent,
    AnalysisComponent,
    PercentileComponent,
    AttemptedCorrectedComponent,
    ComparisonComponent
  ],
  imports: [
    CommonModule,
    ChartModule,
    AppBootStrapModule,
    PipeListModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ReportDetailModule { }
