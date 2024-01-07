import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {MiscellaneousService} from '../../services/miscellaneous.service';

import {environment} from '../../../environments/environment';
import {UtilsService} from '../../core/services/utils.service';
import {LoginService} from '../../core/services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private cd: ChangeDetectorRef,
    private misc: MiscellaneousService,
    private login: LoginService
  ) {
  }

  env = environment;

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

  ngOnInit() {
    this.toggleLoader();
  }

}
