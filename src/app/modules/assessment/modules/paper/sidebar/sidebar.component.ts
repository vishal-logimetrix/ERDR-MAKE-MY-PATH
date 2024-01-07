import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/core/services/utils.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { environment } from 'src/environments/environment';
import { CourseSwitchService } from '../../../services/course-switch.service';
import { DeeplinkService } from '../../../services/deeplink.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(
    private misc: MiscellaneousService,
    private utils: UtilsService,
    private courseswitchservice: CourseSwitchService,
    private networkRequest: NetworkRequestService,
    private deeplinkService : DeeplinkService
  ) {
  }

  env = environment;
  userProfile = {};
  courseId;
  courseDetail;
  examId;
  examDetail;
  showsidebar = false;

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
