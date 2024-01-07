import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {BlogComponent} from './blog.component';
import {BlogListComponent} from './blog-list/blog-list.component';
import {BlogDetailComponent} from './blog-detail/blog-detail.component';

const routes: Routes = [
  {path: '', component: BlogListComponent},
  {path: 'list-blog', component: BlogListComponent},
  {path: 'post-detail/:id', component: BlogDetailComponent},
];

@NgModule({
  declarations: [
    BlogComponent,
    BlogListComponent,
    BlogDetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ]
})
export class BlogModule {
}
