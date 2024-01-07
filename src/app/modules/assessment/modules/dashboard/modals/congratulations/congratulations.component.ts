import {Component, Input, OnInit, TemplateRef, ViewChild, AfterViewInit} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {environment} from '../../../../../../../environments/environment';
import {PermissionsService} from '../../../../../../core/services/permissions.service';

@Component({
  selector: 'app-congratulations',
  templateUrl: './congratulations.component.html',
  styleUrls: ['./congratulations.component.scss']
})
export class CongratulationsComponent implements OnInit, AfterViewInit {

  constructor(
    private modalService: BsModalService,
    private permissions: PermissionsService
  ) {
  }

  isProfileComplete: true;

  env = environment;

  @ViewChild('congratulations', {static: true}) congratulationsModelRef: TemplateRef<any>;
  @Input('modalData') modalData: any;
  modalRef: BsModalRef;

  ngAfterViewInit() {
    if (this.modalData) {
      this.modalRef = this.modalService.show(this.congratulationsModelRef);
    }
  }


  ngOnInit() {
    this.isProfileComplete = this.permissions.isProfileComplete();
  }

}
