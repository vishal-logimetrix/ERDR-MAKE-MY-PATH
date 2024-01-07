import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ImageCropperModule } from 'ngx-image-cropper';


// Components
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  { path: '', component: ProfileComponent }
];

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,

    FormsModule,
    ReactiveFormsModule,

    ImageCropperModule,

    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ProfileModule { }
