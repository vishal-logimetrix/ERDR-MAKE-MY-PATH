import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { FlatPageComponent } from './flat-page.component';
import { PipeListModule } from '../../../shared/modules/pipe-list.module';

const routes: Routes = [
  { path: '', component: FlatPageComponent },
];

@NgModule({
  declarations: [
    FlatPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    PipeListModule,
  ],
  exports: [
    RouterModule
  ]
})
export class FlatPageModule { }
