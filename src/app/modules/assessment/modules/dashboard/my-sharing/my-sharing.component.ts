import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { CourseSwitchService } from '../../../services/course-switch.service';

@Component({
  selector: 'app-my-sharing',
  templateUrl: './my-sharing.component.html',
  styleUrls: ['./my-sharing.component.scss']
})
export class MySharingComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private courseswitchservice: CourseSwitchService,
    private misc: MiscellaneousService
  ) { }

  sharedByMe;
  sharedToMe;
  spinner:boolean = true;

  deeplinkShareSharedPaper(examid, paperid, sharedType) {
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
   var whatsAppUrl = `https://api.whatsapp.com/send?text=https://makemypath.app/assessment/dashboard/respond-paper-request/${examid}?paper=${paperid} | %0D%0A%0D%0A*Hi, I am inviting you to attempt this ${sharedType.toUpperCase()}.*`;
   var a = document.createElement('a');
   a.href = whatsAppUrl;
   a.target = '_blank';
   a.click();
  }
  }

  fetchSharings() {
    this.networkRequest.getWithHeaders(`/api/sharedbymepapers/`)
    .subscribe(
      data => {
        console.log("shared by me ", data);
        this.sharedByMe = data['results'];
        this.spinner = false;
      },
      error => {
        console.log("error ", error);
        this.spinner = false;
      }
    );

    this.networkRequest.getWithHeaders(`/api/sharedtomepapers/`)
    .subscribe(
      data => {
        console.log("shared to me ", data);
        this.sharedToMe = data['results'];
        this.spinner = false;
      },
      error => {
        console.log("error ", error);
        this.spinner = false;
      }
    );
  }

  ngOnInit(): void {
    this.fetchSharings();
    this.courseswitchservice.updateReloadPageStatus(true);
  }

}
