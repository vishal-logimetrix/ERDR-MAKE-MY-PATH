import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notifications-new',
  templateUrl: './notifications-new.component.html',
  styleUrls: ['./notifications-new.component.scss']
})
export class NotificationsNewComponent implements OnInit {

  constructor(
    private networkRequest: NetworkRequestService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  public userProfile$: Subscription;
  public userProfile;
  messages = [];
  fetchedMessage: any;
  fetchedSentMessage: any;
  studentsMessage: any;
  successMsg;
  errors;
  inboxMsgFlag: boolean = true;
  sentMessages = [];
  
  max_page_inbox: number;
  pagesInbox = [];
  currentPageInbox: number;
  startPageInbox: number = 1;
  endPageInbox: number = 1;
  max_page_sent: number;
  pagesSent = [];
  currentPageSent: number;
  startPageSent: number = 1;
  endPageSent: number = 1;
  mentorsList = [];
  currentPageInboxFilter: number;
  startPageInboxFilter: number = 1;
  endPageInboxFilter: number = 1;
  max_page_inbox_filter: number;
  pagesInboxFilter = [];
  selectedChild;
  mentor;
  startDate: NgbDateStruct;
  matter;
  time;
  finalList = [];
  isSubscribed: boolean = false;
  child;
  media = environment.media;
  selectedMentorForMsg;
  selectedMentorForFilter;
  successMsgApt;
  errorsApt;
  fetchedMessageMatter;
  fetchedMessagePassword;

  max_page: number;
  pages = [];
  currentPage = 0;
  statustype = 'unread';
  notificationList: object;
  readActive: boolean;

  fetchParticularMsg(messageId, i: any) {
    let flag: boolean = false;
    // let id = "";
    // for (let i = 0; i < this.notificationList['results'].length; i++){
    //   id = "chat" + i;
    //   document.getElementById(id).classList.remove("active_chat");
    // }
    // id = "chat" + i;
    // document.getElementById(id).classList.add("active_chat");
    for (let i = 0; i < this.notificationList['results'].length; i++) {
      if (this.notificationList['results'][i]['id'] == messageId) {
        this.fetchedMessage = this.notificationList['results'][i];
        flag = true;
        if (!this.notificationList['results'][i]['is_read']) {
          this.changeStatusNotification(messageId, this.notificationList['results'][i]['related_object_id']);
        }
      }
    }
    
  }

  getNotificationsList(statustype: any, page: any) {
    if(statustype==='read'){
      this.readActive= true
    };
    this.networkRequest.getWithHeaders(`/api/notifications_list/${statustype}/?page=${page}`).subscribe(
      (data:object) => {
        this.notificationList = data;
        console.log("notificationList", this.notificationList);
        if (data['count'] % data['page_size'] === 0) {
          this.max_page = Math.floor(data['count'] / data['page_size']);
        } else {
          this.max_page = Math.floor(data['count'] / data['page_size']) + 1;
        }
        this.pages = ' '.repeat(this.max_page).split('');
    });
  }

  changeStatusNotification(id: any, related_object_id: any) {
    this.networkRequest.getWithHeaders(`/api/change_notification_status/${id}/`).subscribe(
      (data:object) => {
        if (data['related_object_id']) {
          this.router.navigate(["/assessment/dashboard/test-list",related_object_id])
          } else {
            this.router.navigate(["/assessment/dashboard/notifications"])
          }
    });
  }

  clickTabs(statustype: string){
    this.fetchedMessage = null;
    this.statustype = statustype;
    this.readActive = false;
    if(statustype==='read'){
      this.readActive= true
    }
    this.currentPage = 0;
    this.goToPage(this.currentPage);
  }
  
  goToPage(pageIndex) {
    this.currentPage = pageIndex;
    this.router.navigate(["/assessment/dashboard/notifications"], { queryParams: {'statustype': this.statustype, 'page': this.currentPage +1 }})
  }

  ngOnInit() {
    this.route.queryParams.subscribe(x => this.getNotificationsList(x.statustype || 'unread' ,x.page || 1));
  }

}
