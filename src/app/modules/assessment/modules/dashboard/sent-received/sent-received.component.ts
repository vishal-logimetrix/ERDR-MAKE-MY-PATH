import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { CourseSwitchService } from '../../../services/course-switch.service';


@Component({
  selector: 'app-sent-received',
  templateUrl: './sent-received.component.html',
  styleUrls: ['./sent-received.component.scss']
})
export class SentReceivedComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private courseswitchservice: CourseSwitchService,
    private misc: MiscellaneousService
  ) { }

  sharedByMe;
  sharedToMe;
  msgType;
  sentMsg = false;
  receivedMsg = false;
  links;
  max_page: number;
  pages = [];
  currentPage: number;
  startPage: number = 1;
  endPage: number = 1;
  sharedByMeCount;
  sharedToMeCount;

  deeplinkShareSharedPaper(examid, paperid, sharedPaper) {
    let ua = navigator.userAgent.toLowerCase();
    let isAndroid = ua.indexOf("android") > -1; // android check
    let isIphone = ua.indexOf("iphone") > -1; // ios check
    if (isIphone == true) {
     let app = { 
       launchApp: function() {
        setTimeout(function() {
          window.location.href = "https://itunes.apple.com/us/app/aptence/id1408667112";
        }, 25);
        window.location.href = "bundlename://linkname"; //which page to open(now from mobile, check its authorization)
       },
       openWebApp: function() {
        window.location.href = "https://itunes.apple.com/us/app/aptence/id1408667112";
       }
   };
   app.launchApp();
  } else if (isAndroid== true) {
     let app = { 
       launchApp: function() {
         window.location.replace("bundlename://com.aptence"); //which page to open(now from mobile, check its authorization)
         setTimeout(this.openWebApp, 500);
       },
       openWebApp: function() {
         window.location.href =  "https://play.google.com/store/apps/details?id=com.aptence";
       }
   };
   app.launchApp();
  }else{
   //navigate to website url
   var whatsAppUrl = `https://api.whatsapp.com/send?text=https://makemypath.app/assessment/dashboard/respond-paper-request/${examid}?paper=${paperid} | %0D%0A%0D%0A*Hi, I am inviting you to attempt this ${sharedPaper.toUpperCase()}.*`;
   var a = document.createElement('a');
   a.href = whatsAppUrl;
   a.target = '_blank';
   a.click();
  }
  }

  fetchSharings() {
    if (this.sentMsg) {
      this.networkRequest.getWithHeaders(`/api/sharedbymepapers/?page=${this.currentPage}`)
    .subscribe(
      data => {
        console.log("shared by me ", data);
        this.sharedByMe = data['results'];
        this.sharedByMeCount = data['count'];
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
        console.log("error ", error);
      }
    );
    }
    else {
      this.networkRequest.getWithHeaders(`/api/sharedtomepapers/?page=${this.currentPage}`)
    .subscribe(
      data => {
        console.log("shared to me ", data);
        this.sharedToMe = data['results'];
        this.sharedToMeCount = data['count'];
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
        console.log("error ", error);
      }
    );
    }
  }
  
  goToPage(pageIndex) {
    this.currentPage = pageIndex;
    this.fetchSharings(); 
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      data1 => {
        if (data1['type']) {
          this.msgType = data1['type'];
          if(this.msgType === 'sent'){
            this.sentMsg = true;
            this.receivedMsg = false;
          }
          else{
            this.sentMsg = false;
            this.receivedMsg = true;
          }
          this.currentPage = 1;
          this.fetchSharings();
        }
      }
    );
    this.courseswitchservice.updateReloadPageStatus(true);
  }

}
