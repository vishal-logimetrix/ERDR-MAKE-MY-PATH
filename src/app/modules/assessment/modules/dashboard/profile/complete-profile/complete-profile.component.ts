import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';

import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {NetworkRequestService} from '../../../../../../services/network-request.service';
import {environment} from '../../../../../../../environments/environment';
import {CookieService} from 'ngx-cookie-service';
import {PermissionsService} from '../../../../../../core/services/permissions.service';


@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.scss']
})
export class CompleteProfileComponent implements OnInit {

  constructor(
    private form: FormBuilder,
    private router: Router,
    private cookie: CookieService,
    private modalService: BsModalService,
    private permissions: PermissionsService,
    private networkRequest: NetworkRequestService,
  ) {
  }

  env = environment;

  @ViewChild('profileModal', {static: true}) profileModalRef: TemplateRef<any>;

  modalRef: BsModalRef;
  modalData: object;
  requiredProfileFields: any = [];
  profileStatusCode: any;

  userState = 1; // Default State Delhi
  userCity = '';
  studentClassList: any;
  boardList: any;

  stateList: any;
  cityList: any;

  feedback = {
    errors: '',
    message: ''
  };


  onSubmit(event: any) {

    const formFields = event.target.elements;
    const userProfileObj = {};

    for (let i in formFields) {
      if (formFields[i]['value']) {
        if (this.requiredProfileFields.includes(formFields[i]['name'])) {
          userProfileObj[`${formFields[i]['name']}`] = formFields[i]['value'];
        }
      }
    }

    // Submit Details
    if (Object.keys(userProfileObj).length !== 0) {
      userProfileObj['status_code'] = this.profileStatusCode;
      this.networkRequest.putWithHeaders(JSON.stringify({user: userProfileObj}), '/api/user/').subscribe(
        data => {
          this.modalRef.hide();
          this.router.navigateByUrl('/assessment/dashboard/profile');
        }
      );
    }
  }


  getProfileStatus() {
    this.networkRequest.getWithHeaders('/api/profile/').subscribe(
      (data: any) => {

        this.profileStatusCode = data['profile']['update_fields']['next_status_code_id'];
        this.requiredProfileFields = data['profile']['update_fields']['data'];

        /** Show Popup only if profile is incomplete and profile is required as well **/
        if (!this.permissions.isProfileRequired() && !this.permissions.isProfileComplete()) {
          this.showProfilePopup(data);
        }

        // Get Class List From Sever Class is Missing
        if (this.requiredProfileFields.includes('studentClass')) {
          this.getClassList();
        }

        // Get Board List From Server if Student board is missing
        if (this.requiredProfileFields.includes('studentBoard')) {
          this.getBoardList();
        }

        // Get State & City list from server if state or institute state is missing
        if (this.requiredProfileFields.includes('state') || this.requiredProfileFields.includes('institute_state')) {
          this.getStateList();
        }
      });
  }


  getBoardList() {
    this.networkRequest.getWithHeaders('/api/userboard/').subscribe(
      data => {
        this.boardList = data;
      }
    );
  }


  getClassList() {
    this.networkRequest.getWithHeaders('/api/userclass/').subscribe(
      data => {
        this.studentClassList = data;
      }
    );
  }


  getStateList() {

    this.networkRequest.getWithHeaders(`/api/states/?country_id=${this.env.COUNTRY_ID}`).subscribe(
      data => {
        this.stateList = data;
        this.getCityList(this.userState);
      }
    );
  }


  getCityList(stateId) {
    this.networkRequest.getWithHeaders(`/api/cities/?state_id=${stateId}`).subscribe(
      data => {
        this.cityList = data;
      }
    );
  }


  checkFieldAvailability(field) {
    return this.requiredProfileFields.includes(field);
  }


  showProfilePopup(data) {
    // Show Modal only if details are missing
    if (data['profile']['update_fields']['data'].length !== 0 && this.checkProfileModalVisibility()) {
      this.modalRef = this.modalService.show(this.profileModalRef);
      this.cookie.set('_vm', JSON.stringify(false), 0, '/');
    }
  }


  checkProfileModalVisibility() {

    /**
     * Returns profile popup visibility status
     */

    let profilePopupAllowed = this.cookie.get('_vm');

    if (profilePopupAllowed) {
      profilePopupAllowed = JSON.parse(profilePopupAllowed);
      return profilePopupAllowed;
    } else {
      return true;
    }
  }

  ngAfterViewInit() {
  }


  ngOnInit() {
    this.getProfileStatus();
  }

}
