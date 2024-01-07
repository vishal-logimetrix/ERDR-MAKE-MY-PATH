import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { CourseSwitchService } from '../../../services/course-switch.service';

@Component({
  selector: 'app-exam-goal',
  templateUrl: './exam-goal.component.html',
  styleUrls: ['./exam-goal.component.scss']
})
export class ExamGoalComponent implements OnInit {

  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('openModal') openModal: ElementRef;
  
  mentors = [1, 2];

  batchCode;
  batchDetail;
  examDetails;
  goals;
  batchId;
  shareBatchCode;
  examId;
  totalusers;
  public showContent: boolean = false;
  public showContentSecond: boolean = false;
  public showContentThird: boolean = false;
  public showContentFourth: boolean = false;
  public showContentFifth:boolean = false;
  public showContentOverlay:boolean = false;
  deletionId;

  constructor(
    private networkRequest: NetworkRequestService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private courseswitchservice: CourseSwitchService
  ) { }

  calculateDiff(dateSent){
    let currentDate = new Date();
    dateSent = new Date(dateSent);
    if (( Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) - Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) ) /(1000 * 60 * 60 * 24) < 0) {
      return(0);
    }
    else {
      return Math.floor(( Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) - Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) ) /(1000 * 60 * 60 * 24));
    }
}

onLikeClicked(event) {
  event.stopPropagation();
}

setDeletionId(event, id) {
  event.stopPropagation();
  this.deletionId = id;
  this.openModal.nativeElement.click();
}
clearSelection() {
  this.deletionId = null;
}
deactivateGoal(id) {
  
  // var confirmation = confirm("Are you sure you want to remove this path?");
  //   if (confirmation) {
      const formData = {
        goal: id
      }
      this.networkRequest.putWithHeaders(formData, `/api/deactivatelearnerexamgoal/`).subscribe(
        data => {
          console.log("done ", data);
          this.toastr.success('Path removed!', 'Done!', {
            timeOut: 4000,
          });
          this.closeModal.nativeElement.click();
          this.fetchgoals();
        },
        error => {
          this.toastr.error(error['error']['message'], 'Error!', {
            timeOut: 4000,
          });
        }
      )
    // }
}

  goalExamCreation(id) {
    const formData = {
      goal: id
    }
    this.networkRequest.putWithHeaders(formData, `/api/fetchgoalpathassessmentques/`)
      .subscribe(
        data => {
          console.log("goal questions ", data);
          this.courseswitchservice.updateReloadPageStatus(true);

          this.router.navigate([`/assessment/paper/goal-paper-instructions/${this.examId}`],{
            queryParams: {
              paper: data['id']
            }
          });
        },
        error => {
          console.log("error", error);
        if (error['error']['message']) {
          this.toastr.error(error['error']['message'], 'Error!', {
            timeOut: 4000,
          });
        }
        else if (error['error']) {
          this.toastr.error(error['error'], 'Error!', {
            timeOut: 4000,
          });
        }
        else {
          this.toastr.error('Some error occured!', 'Error!', {
            timeOut: 4000,
          });
        }
        }
      );
  }

  generateAssessmentPaper(id) {
    const formData = {
      goal: id
    }
    this.networkRequest.putWithHeaders(formData, `/api/creategoalassessment/`)
    .subscribe(
      data => {
        console.log("assessment paper generated ", data);
        // this.misc.hideLoader();
      
        this.router.navigate([`/assessment/paper/self-assessment-paper/${this.examId}`],{
          queryParams: {
            paper: data['id']
          }
        });
      },
      error => {
        console.log("error", error);
        if (error['error']['message']) {
          this.toastr.error(error['error']['message'], 'Error!', {
            timeOut: 4000,
          });
        }
        else if (error['error']) {
          this.toastr.error(error['error'], 'Error!', {
            timeOut: 4000,
          });
        }
        else {
          this.toastr.error('Some error occured!', 'Error!', {
            timeOut: 4000,
          });
        }
      }
    );
  }

  fetchgoals() {
    this.networkRequest.getWithHeaders(`/api/learnerexamgoals/?exam=${this.examId}`).subscribe(
      data => {
        this.goals = data;
        console.log("Goals ", data);
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
  }

  updatePercentage() {
    const formData = {
      exam: this.examId
    }
    this.networkRequest.putWithHeaders(formData, `/api/examalllearnergoalspercentageupdate/`).subscribe(
      data => {
        console.log("examalllearnergoalspercentageupdate ", data);
      },
      error => {
        console.log("error", error);
      }
    )
  }

  ngOnInit(): void {
    this.courseswitchservice.examIdStatus.subscribe(
      data => {
        if (!data) {
          this.route.params.subscribe(
            data1 => {
              if (data1['exam']) {
                this.courseswitchservice.updateExamId(data1['exam']);
                this.examId = data1['exam'];
                this.fetchgoals();
                // this.updatePercentage();
              }
            }
          );
        }
        else {
          this.examId = data;
          this.fetchgoals();
          // this.updatePercentage();
        }
    });
    setTimeout(()=>this.showContent=true, 1000);
    setTimeout(()=>this.showContentSecond=true, 1500);
    setTimeout(()=>this.showContentThird=true, 2000);
    setTimeout(()=>this.showContentFourth=true, 2500);
    setTimeout(()=>this.showContentFifth=true, 3000);
    setTimeout(()=>this.showContentOverlay=true, 3500);

  }

}
