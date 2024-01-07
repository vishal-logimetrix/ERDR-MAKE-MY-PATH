import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {NgxImageCompressService} from 'ngx-image-compress';

// Components
import { TestComponent } from './test.component';

const routes: Routes = [
  { path: '', component: TestComponent }
];

@NgModule({
  declarations: [
    TestComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [NgxImageCompressService],
  exports: [
    RouterModule
  ]
})
export class TestModule { }
