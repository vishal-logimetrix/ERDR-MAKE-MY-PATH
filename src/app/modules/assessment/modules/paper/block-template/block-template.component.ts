import { Component, OnInit, Output } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CourseSwitchService } from '../../../services/course-switch.service';

@Component({
  selector: 'app-block-template',
  templateUrl: './block-template.component.html',
  styleUrls: ['./block-template.component.scss']
})
export class BlockTemplateComponent implements OnInit {

  constructor(
    private courseswitchservice: CourseSwitchService
  ) { }
  message: any;
  @BlockUI() blockUI: NgBlockUI;

  resumed: boolean = false;

  stopBlocking() {
    this.resumed = true;
    this.courseswitchservice.updateExamResumeStatus(this.resumed);
  }

  ngOnInit(): void {
  }

}
