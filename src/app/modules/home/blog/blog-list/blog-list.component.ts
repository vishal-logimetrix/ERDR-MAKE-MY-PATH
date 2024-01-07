import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NetworkRequestService} from '../../../../services/network-request.service';
import {environment} from '../../../../../environments/environment';
import {MiscellaneousService} from '../../../../services/miscellaneous.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BlogListComponent implements OnInit {

  constructor(
    private networkRequest: NetworkRequestService,
    private misc: MiscellaneousService,
  ) {
  }

  env = environment;

  categoryObj: any = [];
  blogObj: any = [];
  latestBlogs: any = [];


  getCategories() {

    this.misc.showLoader('short')
    this.networkRequest.getWithHeaders('/api/blog/categories/').subscribe(
      data => {
        this.categoryObj = data;
        this.getBlogs();
      }
    );
  }


  getBlogs() {
    this.networkRequest.getWithHeaders('/api/blog/').subscribe(
      data => {
        this.blogObj = data;
        this.latestBlogs = this.blogObj.slice(0, 5);
        this.misc.hideLoader()
      },
      error => {
        this.misc.hideLoader()
      }
    );
  }

  ngOnInit() {
    this.getCategories();
  }

}
