import { Component, OnInit } from '@angular/core';
import { NetworkRequestService } from '../../../../../services/network-request.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  constructor(
    private networkRequest: NetworkRequestService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  notificationList: object;
  max_page: number;
  pages = [];
  currentPage = 0;
  statustype = 'unread';
  readActive: boolean;

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
            this.router.navigate(["/assessment/dashboard/view-notifications"])
          }
    });
  }

  clickTabs(statustype: string){
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
    this.router.navigate(["/assessment/dashboard/view-notifications"], { queryParams: {'statustype': this.statustype, 'page': this.currentPage +1 }})
  }

  ngOnInit() {
    this.route.queryParams.subscribe(x => this.getNotificationsList(x.statustype || 'unread' ,x.page || 1));
  }

}
