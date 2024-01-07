import {Component, OnInit} from '@angular/core';

import {environment} from '../../../../../../../environments/environment';
import {MiscellaneousService} from '../../../../../../services/miscellaneous.service';
import {UtilsService} from '../../../../../../core/services/utils.service';
import { CourseSwitchService } from 'src/app/modules/assessment/services/course-switch.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { DeeplinkService } from 'src/app/modules/assessment/services/deeplink.service';
import { PermissionsService } from 'src/app/core/services/permissions.service';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.scss']
})
export class DashboardSidebarComponent implements OnInit {

  constructor(
    private misc: MiscellaneousService,
    private utils: UtilsService,
    private courseswitchservice: CourseSwitchService,
    private networkRequest: NetworkRequestService,
    private deeplinkService : DeeplinkService,
    private permissions: PermissionsService
  ) {
  }

  env = environment;
  userProfile = {};
  courseId;
  courseDetail;
  examId;
  examDetail;
  showsidebar = false;
  isAuthenticated = this.permissions.isauthenticated();

  hideSidebar() {
    if (this.utils.isMobile()) {
      this.misc.showMobileSidebar.next(false);
      
    }
  }
  toggleSidebar() {
    // this.showsidebar = !this.showsidebar;
    this.misc.showMobileSidebar.next(this.showsidebar);
  }

  getUserProfile() {
    this.misc.userProfile().subscribe(
      data => {
        this.userProfile = data;
      }
    );
  }

  shareApp() {
    this.deeplinkService.deeplink();
  }


  ngOnInit() {

    this.getUserProfile();

    this.misc.userProfileChange.subscribe(
      data => {
        this.getUserProfile();
      }
    );
    

    this.courseswitchservice.examIdStatus.subscribe(
      data1 => {
        this.examId = data1;
        if (this.examId) {
          this.networkRequest.getWithHeaders(`/api/courses/${this.examId}/`)
          .subscribe(
            data => {
              this.examDetail = data;
            },
            error => {
            });
        }
        
    });

  }

}
