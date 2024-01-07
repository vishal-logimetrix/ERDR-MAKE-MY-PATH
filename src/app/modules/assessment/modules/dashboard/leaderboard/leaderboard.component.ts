import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { CourseSwitchService } from '../../../services/course-switch.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {

  constructor(
    private networkRequest: NetworkRequestService,
    private courseswitchservice: CourseSwitchService,
    private route: ActivatedRoute
  ) { }

  selectedDomainId;
  examId;
  examDetails;
  totalusers;
  spinner:boolean = true;

  dayLimit = '7 Days';
  leaderBoardData:any;
  dataRecievedForLeaderBoard: any = {
    schoolWise: {
      day30: {
        dayLoaded: false,
        data: []
      },
      day7: {
        dayLoaded: false,
        data: []
      },
      dayAll: {
        dayLoaded: false,
        data: []
      },
    },
    nationWise: {
      day30: {
        dayLoaded: false,
        data: []
      },
      day7: {
        dayLoaded: false,
        data: []
      },
      dayAll: {
        dayLoaded: false,
        data: []
      },
    }
  }
  callApiPostfixs: string = '7';
  storeInObjectOf: string = 'nationWise';
  storeInDayOf: string = 'day7';
  loadDataForNationOrSchool: boolean = true; // 'true'=> need to Load as Nation wise, 'false'=> need to Load School Wise
  dataLoaded: boolean = false
  clickedItem: any = null;
  currentUserData: any;
  schoolNotAvlModalOpened: boolean = false;
  exams;
  domains;
  leaderBoardDatab = [];
  selectedExamId;
  myData;

  fetchLeaderboard(exam) {
    this.leaderBoardData = null;
    this.selectedExamId = exam;
    this.networkRequest.getWithHeaders(`/api/leaderboard/?exam=${exam}`)
    .subscribe(
      data => {
        console.log("leaderboard data ", data);
        this.spinner = false;
        this.leaderBoardData = data['leaderboard_data'];
        this.myData = data['my_data'];
      },
      error => {
        console.log("error ", error);
        this.spinner = false;
      }
    );
  }

  getCourses() {
    this.networkRequest.getWithHeaders('/api/domain/')
      .subscribe(
        data => {
          console.log("courses ", data);
          this.domains = data;
          if (this.domains.length > 0) {
            this.selectedDomainId = this.domains[0]['id'];
            this.getDomainExams(this.selectedDomainId);
          }
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  getDomainExams(id) {
    this.selectedDomainId = id;
    this.leaderBoardData = null;
    this.networkRequest.getWithHeaders(`/api/domain/exams?domain=${this.selectedDomainId}`)
    .subscribe(
      data => {
        console.log("domain exams ", data);
        this.exams = data;
        if (this.exams.length > 0) {
          this.fetchLeaderboard(this.exams[0]['id']);
        }
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  modalData(modalDataPassed){
    this.clickedItem = modalDataPassed
  }

  incDayLimit(dayLimitPassed: string){
    this.dayLimit = dayLimitPassed;
    if(this.dayLimit === '30 Days'){
      this.callApiPostfixs = '30';
      this.storeInDayOf = 'day30'
    }
    if(this.dayLimit === 'Over All'){
      this.callApiPostfixs = '2000'
      this.storeInDayOf = 'dayAll'
    }
    if(this.dayLimit === '7 Days'){
      this.callApiPostfixs = '7';
      this.storeInDayOf = 'day7'
    }
  }

  getExamDetails() {
    this.networkRequest.getWithHeaders(`/api/courses/${this.examId}/`)
      .subscribe(
        data => {
          console.log("exam details ", data);
          this.examDetails = data;
          this.fetchLeaderboard(this.examId);
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


  ngOnInit(): void {
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
  }

}
