import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { CommonModule } from '@angular/common';

// Modules
import { HomeModule } from './modules/home/home.module';
import { AppBootStrapModule } from './bootstrap-module';

// Permission Services
import { AuthGuard } from './permissions/auth.guard';
import { CanActivateAdminGuard } from './permissions/can-activate-admin.guard'
import { CanActivateInstituteGuard } from './permissions/can-activate-institute.guard';
import { CanActivateOrganizationGuard } from './permissions/can-activate-organization.guard';

const routes: Routes = [
  {
    path: 'assessment',
    loadChildren: () => import('./modules/assessment/assessment.module').then(m => m.AssessmentModule),
    canLoad: [AuthGuard]
  },

  {
    path: 'institute',
    loadChildren: () => import('./modules/institute/institute.module').then(m => m.InstituteModule),
    canLoad: [CanActivateInstituteGuard]
  },

  {
    path: 'organization',
    loadChildren: () => import('./modules/organization/organization.module').then(m => m.OrganizationModule),
    canLoad: [CanActivateOrganizationGuard]
  },
];

@NgModule({
  imports: [
    CommonModule,

    HomeModule,
    AppBootStrapModule,
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', preloadingStrategy: PreloadAllModules, initialNavigation: 'enabled', anchorScrolling: 'enabled', scrollOffset: [0, 64] })
  ],

  declarations: [],

  exports: [RouterModule]
})
export class AppRoutingModule { }