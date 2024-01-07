import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { InstituteOrganizationService } from 'src/app/services/institute-organization.service';
import * as _ from 'lodash';
import { CookieService } from 'ngx-cookie-service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-institute',
  templateUrl: './institute.component.html',
  styleUrls: ['./institute.component.scss']
})
export class InstituteComponent implements OnInit {
  navbarOpen: boolean = true;
  instituteOrganizationProfileData: any;
  displaydata: boolean = false;
  constructor(
    private cd: ChangeDetectorRef,
    private misc: MiscellaneousService,
    private auth: AuthService,
    private instituteOrganizationsvc: InstituteOrganizationService,
    private networkRequest: NetworkRequestService,
    private utils: UtilsService,
    private cookie: CookieService
  ) { 
    this.getUserProfile();
  }

  logout() {
    this.auth.logout()
  }

  env = environment;

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  showLoader = {
    visibility: false,
    type: 'short'
  };

  detectComponentChanges() {
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }


  toggleLoader() {
    this.misc.showLoaderSubject.subscribe(data => {

      this.showLoader.visibility = data['visibility'];
      if (data['type']) {
        this.showLoader.type = data['type'];
      }
      this.detectComponentChanges();
    });
  }

  getUserProfile() {
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

  ngOnInit() {
    this.toggleLoader();
    this.instituteOrganizationsvc.instituteOrganizationProfileData
      .subscribe((data) => {
        this.instituteOrganizationProfileData = data;
        if (!_.isEmpty(this.instituteOrganizationProfileData)) {
          this.displaydata = true;
        }
      });
    // this.getUserProfile();
  }
}
