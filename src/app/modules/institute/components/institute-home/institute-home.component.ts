import { Component, OnInit } from '@angular/core';
import { InstituteOrganizationService } from 'src/app/services/institute-organization.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import * as _ from 'lodash';
import { PermissionsService } from 'src/app/core/services/permissions.service';

@Component({
  selector: 'app-institute-home',
  templateUrl: './institute-home.component.html',
  styleUrls: ['./institute-home.component.scss']
})
export class InstituteHomeComponent implements OnInit {
  instituteOrganizationProfileData: any;
  displaydata: boolean = false;
  constructor(
    private instituteOrganizationsvc: InstituteOrganizationService,
    private misc: MiscellaneousService,
    private permissions: PermissionsService
  ) { }

  isContentManager = this.permissions.isContentManager();

  ngOnInit() {
    this.misc.showLoader('short');
    this.instituteOrganizationsvc.instituteOrganizationProfileData
      .subscribe((data) => {
        this.instituteOrganizationProfileData = data;
        if (!_.isEmpty(this.instituteOrganizationProfileData)) {
          this.displaydata = true;
          this.misc.hideLoader();
        }
      });
  }

}
