import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NetworkRequestService} from 'src/app/services/network-request.service';
import {MiscellaneousService} from '../../../services/miscellaneous.service';

@Component({
  selector: 'app-flat-page',
  templateUrl: './flat-page.component.html',
  styleUrls: ['./flat-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FlatPageComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private misc: MiscellaneousService,
    private networkRequest: NetworkRequestService
  ) {
  }

  pageList: any;
  currentPage: string;
  pageObj: any;


  fetchPageData() {
    this.misc.showLoader('short');
    this.networkRequest.getWithHeaders('/api/pages/').subscribe(
      data => {
        this.pageList = data;
        this.getPage();
        this.misc.hideLoader();
      },
      error => {
        this.misc.hideLoader();
      }
    );
  }


  getPage() {
    this.pageObj = this.pageList.find(page => {
      return page.url.includes(this.currentPage);
    });
  }


  ngOnInit() {
    this.route.params.subscribe(page => {
      this.currentPage = page.name;
      if (this.pageList) {
        this.getPage();
      }
    });
    this.fetchPageData();
  }
}
