import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/core/services/utils.service';
import { environment } from '../../../../../environments/environment';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';

@Component({
  selector: 'app-paper',
  templateUrl: './paper.component.html',
  styleUrls: ['./paper.component.scss']
})
export class PaperComponent implements OnInit {

  constructor(
    private cd: ChangeDetectorRef,
    private misc: MiscellaneousService,
    private utils: UtilsService,
    private router: Router
  ) {
    this.toggleSidebar();
   }
  env = environment

  showLoader = {
    visibility: false,
    type: 'full'
  }

  isMobile = this.utils.isMobile();
  showSidebar = false;

  
  detectComponentChanges() {
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }


  toggleLoader() {
    this.misc.showLoaderSubject.subscribe(data => {
      this.showLoader.visibility = data['visibility']
      if (data['type']) this.showLoader.type = data['type']
      this.detectComponentChanges()
    })
  }

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
      this.misc.showMobileSidebar.next(false);

      // Hide sidebar on page change
      this.router.events.subscribe(
        data => {
          this.misc.showMobileSidebar.next(false);
        }
      );
    }
  }


  ngOnInit() {
    this.hideSidebar();
    this.toggleLoader();
  }

}
