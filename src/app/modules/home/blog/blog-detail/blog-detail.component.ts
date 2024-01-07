import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Meta} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {NetworkRequestService} from '../../../../services/network-request.service';

import {environment} from '../../../../../environments/environment';
import {MiscellaneousService} from '../../../../services/miscellaneous.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BlogDetailComponent implements OnInit {

  constructor(
    private meta: Meta,
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private misc: MiscellaneousService,
  ) {
  }

  private env = environment;

  postObj: any = {};

  getPostDetails(postId) {
    this.misc.showLoader('short');
    this.networkRequest.getWithHeaders(`/api/blog/${postId}/`).subscribe(
      data => {
        this.postObj = data;

        if (data['metadescription'] && data['metakeywords']) {
          this.addMetaData(data['metadescription'], data['metakeywords']);
        }

        this.misc.hideLoader();
      }, error => {
        this.misc.hideLoader();
      }
    );
  }


  addMetaData(description, keywords) {

    keywords = keywords.map(e => e.keys).join(', ');

    this.meta.addTag({name: 'description', content: description});
    this.meta.addTag({name: 'keywords', content: keywords});
  }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.getPostDetails(data['id']);
    });
  }

}
