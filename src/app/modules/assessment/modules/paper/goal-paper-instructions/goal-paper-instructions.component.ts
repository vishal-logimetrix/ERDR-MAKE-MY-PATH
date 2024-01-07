import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from '../../../../../services/network-request.service';
import { CourseSwitchService } from '../../../services/course-switch.service';

@Component({
  selector: 'app-goal-paper-instructions',
  templateUrl: './goal-paper-instructions.component.html',
  styleUrls: ['./goal-paper-instructions.component.scss']
})
export class GoalPaperInstructionsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private courseswitchservice: CourseSwitchService,
    private misc: MiscellaneousService
  ) {
  }

  testId: any;
  testType: any;
  attemptOrder: any;
  testObj: object = {};
  question: object;
  paperId;
  totalusers;
  domainId;
  examId;
  userProfileObj: any;
  instructions;
  show: boolean = false;
  examDetails;
  currentStep: number = 3;
  currentStepNew: number = 2;
  // abcd:boolean = true;
  efgh:boolean = true;
  paperDetails;

  status: boolean = false;
  clickEvent(){
      this.status = !this.status;       
  }

  sharemailUrl(examid, paperid) {
    this.clickEvent();
    window.open('mailto:?subject=' + encodeURIComponent(document.title) + '&body=' + encodeURIComponent('https://makemypath.app/assessment/dashboard/respond-paper-request/' + examid + '?paper=' + paperid + ' \nHi I am inviting you to accept the exam paper created by me'));
    return false;
  }

  shareinstaUrl(examid, paperid) {
    this.clickEvent();
    window.open('https://instagram.com/accounts/login/?text=%20Check%20up%20this%20exam%20paper' + encodeURIComponent(document.title) + ':%20 ' + encodeURIComponent('https://makemypath.app/assessment/dashboard/respond-paper-request/' + examid + '?paper=' + paperid + ' \nHi I am inviting you to accept the exam paper created by me'));
    return false;
  }

  skipassessment(id) {
    const formData = {
      goal: id
    }

    this.networkRequest.putWithHeaders(formData, `/api/skipgoalassessment/`)
    .subscribe(
      data => {
      },
      error => {
      }
    );
  }

  getTestInstructions() {
    this.networkRequest.getWithHeaders(`/api/goalpaperinstructions/?paper=${this.paperId}`)
    .subscribe(
      data => {
        console.log("paper instructions ", data);
        this.instructions = data;
      },
      error => {
        console.log("error ", error);
      }
    );
    this.networkRequest.getWithHeaders(`/api/goalpapersshort/${this.paperId}/`)
    .subscribe(
      data => {
        console.log("paper details ", data);
        this.paperDetails = data;
        this.getExamDetails();
        this.checkFirstPath();
      },
      error => {
      });
  }

  checkFirstPath() {
    const formData = {
      goal: this.paperDetails['goal']['id']
    }
    this.networkRequest.putWithHeaders(formData, `/api/checkforfirstpathcreation/`).subscribe(
      data => {
        console.log("check first path ", data);
      },
      error => {
      }
    )
  }

  getExamDetails() {
  
    this.networkRequest.getWithHeaders(`/api/courses/${this.examId}/`)
      .subscribe(
        data => {
          console.log("exam details ", data);
          this.examDetails = data;
        },
        error => {
          console.log("error ", error);
        }
      );
      this.networkRequest.getWithHeaders(`/api/examuserscount/?exam=${this.examId}`)
      .subscribe(
        data => {
          console.log("total users ", data);
          this.totalusers = data['totalusers'];
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  ngOnInit() {
   
    this.courseswitchservice.examIdStatus.subscribe(
      data => {
        if (!data) {
          this.route.params.subscribe(
            data1 => {
              if (data1['exam']) {
                this.courseswitchservice.updateExamId(data1['exam']);
                this.examId = data1['exam'];
                this.getExamDetails();
              }
            }
          );
        }
        else {
          this.examId = data;
          this.getExamDetails();
        }
    });

    this.route.queryParams.subscribe(
      params => {
        this.paperId = params.paper;
        this.getTestInstructions();
      }
    );

    // Get User Profile
    this.misc.userProfile().subscribe(
      data => {
        this.userProfileObj = data;
      }
    );
    this.courseswitchservice.reloadPagetatus.subscribe(
      data => {
        if (data) {
          setTimeout(() => {
            window.location.reload();
            this.courseswitchservice.updateReloadPageStatus(false);
          }, 500);
          
        }
    });
    
    setTimeout(() => {
      this.show = true;
      this.efgh = false;
    }, 1000);
    
  }

}
