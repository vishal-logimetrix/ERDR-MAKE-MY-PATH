import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { PermissionsService } from './core/services/permissions.service';
import { InstituteOrganizationService } from './services/institute-organization.service';
import { CourseSwitchService } from './modules/assessment/services/course-switch.service';
import { UtilsService } from './core/services/utils.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './services/auth.service';
import { NetworkRequestService } from './services/network-request.service';
export let browserRefresh = false;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Aptination';
  location;

  subscription: Subscription;
  constructor(
    private router: Router,
    private pemissionsvc: PermissionsService,
    private instituteOrganizationsvc: InstituteOrganizationService,
    private courseswitchservice: CourseSwitchService,
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private auth: AuthService,
    private cookie: CookieService,
    private utils: UtilsService
  ) {
    // console.log("app  ts", this.pemissionsvc.isInstituteStaff());
    this.subscription = router.events.subscribe((event) => {
      if ((this.pemissionsvc.isInstituteStaff() || this.pemissionsvc.isOrganizationStaff()) && event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
        if (browserRefresh) {
          // console.log("app  ts");
          this.instituteOrganizationsvc.getInstituteOrganizationProfile().subscribe(data => {
            this.instituteOrganizationsvc.loadInstituteOrganizationProfileData(data)
          });
        }
      }
    });
  }

  ngOnInit() {
    if(this.pemissionsvc.isStudent()) {
      // this.router.navigate(['assessment/dashboard']);

      this.courseswitchservice.examIdStatus.subscribe(
        data => {
          if (!data) {
            this.route.params.subscribe(
              data1 => {
                if (data['exam']) {
                  this.courseswitchservice.updateExamId(data1['exam']);
                }
              }
            );
          }
      });
    }

    if (window.location.pathname == '/' && (this.pemissionsvc.isMMPAdmin() || this.pemissionsvc.isContentManager())) {
      this.router.navigate(['/institute']);
    }

    if (window.location.pathname == '/' && this.pemissionsvc.isStudent()) {
      this.router.navigate(['/assessment/dashboard']);
    }

    if (window.location.pathname == '/' && this.pemissionsvc.isTeacher()) {
      this.router.navigate(['/organization']);
    }

    this.router.events.subscribe((val) => {
      if (this.pemissionsvc.isMMPAdmin() || this.pemissionsvc.isContentManager()) {
        console.log("aygdhhjdh");
        const token = this.cookie.get('_l_a_t');
        const decoded_token = this.utils.decodeToken(token);
        this.networkRequest.getWithHeaders('/api/shortprofile/').subscribe(
          data => {
            var tokenDate = new Date(decoded_token['logged_on']);
            var tmpDate = new Date(data['profile']['logout_updated_on']);
            
            if (!decoded_token['logged_on']) {
              this.auth.logout();
            }
            if (tmpDate.getTime() >= tokenDate.getTime()) {
              this.auth.logout();
            }
          },
          error => {
          }
        );
      } 
    });

    
  }
}
