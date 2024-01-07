import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-my-papers',
  templateUrl: './my-papers.component.html',
  styleUrls: ['./my-papers.component.scss']
})
export class MyPapersComponent implements OnInit {

  constructor(
    private networkRequest: NetworkRequestService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  myPapers;
  links;
  max_page: number;
  pages = [];
  currentPage: number;
  startPage: number = 1;
  endPage: number = 1;

  reattempt(exam, paper) {
    const formData = {
      paper: paper
    }
    this.networkRequest.putWithHeaders(formData, `/api/paperreattempt/`)
    .subscribe(
      data => {
        console.log("paper created ", data);
        // this.toastr.success('New Paper Created!', 'Created!', {
        //   timeOut: 4000,
        // });
        if (data['paper_type'] == 'practice') {
          this.router.navigate([`/assessment/paper/practice-paper/${exam}`],{
            queryParams: {
              paper: data['id']
            }
          });
        }
        else {
          this.openNewPaper(exam, data['id']);
        }
      },
      error => {
        console.log("error ", error);
        this.toastr.error(error['error']['message'], 'Error!', {
          timeOut: 4000,
        });
      }
    );
  }

  openNewPaper(exam, paper) {
    
    const testWindowUrl = `/assessment/paper/test-instructions/${exam}?paper=${paper}`;
    // console.log("testWindowUrl", testWindowUrl);
    // Open new test window
    const testWindow = window.open(testWindowUrl, 'Test', 'fullscreen');

    // // Test window settings
    if (testWindow.outerWidth < screen.availWidth || testWindow.outerHeight < screen.availHeight) {
      testWindow.moveTo(0, 0);
      testWindow.resizeTo(screen.availWidth, screen.availHeight);
    }
  }

  goToPage(pageIndex) {
    this.currentPage = pageIndex;
    this.getMyPapers();
  }

  getMyPapers() {
    this.networkRequest.getWithHeaders(`/api/learnerpapers/?page=${this.currentPage}`)
    .subscribe(
      data => {
        console.log("learner papers ", data);
        this.myPapers = data['results'];
        let page_size = data['page_size'];
        this.links = data['links'];
        if (data['count'] % page_size === 0) {
          this.max_page = Math.floor(data['count'] / page_size);
        } else {
          this.max_page = Math.floor(data['count'] / page_size) + 1;
        }
        this.pages = ' '.repeat(this.max_page).split('');
        if (this.max_page < 11) {
          // less than 10 total pages so show all
          this.startPage = 1;
          this.endPage = this.max_page;
        } else if (this.currentPage < 6) {
          this.startPage = 1;
          this.endPage = 10;
        } else if (this.currentPage >= 6 && this.currentPage < this.max_page - 5) {
          this.startPage = this.currentPage - 4;
          this.endPage = this.currentPage - (-5);
        } else {
          this.startPage = this.max_page - 9;
          this.endPage = this.max_page;
        }
      },
      error => {
        console.log("error", error);
      }
    );
  }

  ngOnInit(): void {
    this.goToPage(1);
  }
}
