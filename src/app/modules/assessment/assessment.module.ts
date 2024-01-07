import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';

// Components
import {AssessmentComponent} from './assessment.component';
import {CanActivateDashboardGuard} from '../../permissions/can-activate-dashboard.guard';
import { TestService } from 'src/app/services/test.service';
import { NgxImageCompressService } from 'ngx-image-compress';


const routes: Routes = [
  {
    path: '', component: AssessmentComponent,
    children: [
      {
        path: 'paper',
        loadChildren: () => import('./modules/paper/paper.module').then(m => m.PaperModule),
        canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
    ]
  },
];

@NgModule({
  declarations: [
    AssessmentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  providers: [TestService,
    NgxImageCompressService]
})
export class AssessmentModule {
}
