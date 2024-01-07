import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../../../../environments/environment';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';
import { UtilsService } from '../../../../core/services/utils.service';
import { PaymentService } from '../../../../services/payment.service';
import { PermissionsService } from '../../../../core/services/permissions.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private misc: MiscellaneousService,
    private utils: UtilsService,
    private payment: PaymentService,
    private permission: PermissionsService,
  ) {
    this.toggleSidebar();
  }

  env = environment;

  isMobile = this.utils.isMobile();
  isAuthenticated = this.permission.isauthenticated();
  showSidebar = false;
  showLoader = {
    visibility: false,
    type: 'full'
  };

  newAssessmentObj = {
    assessmentPurchased: false,
    item: ''
  };

  isProfileComplete = false;

  toggleSidebar() {

    // Handles Sidebar on mobile
    this.misc.showMobileSidebar.subscribe(
      data => {
        this.showSidebar = data;

        // Detect Component Changes
        this.detectComponentChanges();
      }
    );
  }


  hideSidebar() {

    /**
     * Hides Sidebar
     */

    if (this.isMobile) {
      // this.showSidebar = true;
      this.misc.showMobileSidebar.next(false);

      // Hide sidebar on page change
      this.router.events.subscribe(
        data => {
          this.misc.showMobileSidebar.next(false);
        }
      );
    }
    else{
      this.showSidebar = false;
    }
  
  }


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


  checkNewAssessment() {
    if (this.payment.payment.assessmentPurchased) {
      this.newAssessmentObj = {
        assessmentPurchased: this.payment.payment.assessmentPurchased,
        item: this.payment.payment.item
      };
      this.payment.payment.assessmentPurchased = false;
    }
  }


  ngOnInit() {

    // Hide sidebar on page load
    this.hideSidebar();
    this.toggleLoader();
    if (this.isAuthenticated) {
      this.misc.userProfile().subscribe();
    }

    this.isProfileComplete = this.permission.isProfileComplete(); // Check if profile is complete

    this.checkNewAssessment();
    // this.misc.showMobileSidebar.subscribe(
    //   data => {
    //     this.showSidebar = data;
    //   }
    // );
  }

}
