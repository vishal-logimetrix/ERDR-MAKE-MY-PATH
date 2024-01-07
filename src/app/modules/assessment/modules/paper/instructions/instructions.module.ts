import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// Components
import { InstructionsComponent } from './instructions.component';

const routes: Routes = [
  { path: '', component: InstructionsComponent }
];

@NgModule({
  declarations: [
    InstructionsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class InstructionsModule { }
