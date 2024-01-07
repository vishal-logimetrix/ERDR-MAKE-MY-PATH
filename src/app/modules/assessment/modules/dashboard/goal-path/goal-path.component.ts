import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PermissionsService } from 'src/app/core/services/permissions.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { CourseSwitchService } from '../../../services/course-switch.service';

@Component({
  selector: 'app-goal-path',
  templateUrl: './goal-path.component.html',
  styleUrls: ['./goal-path.component.scss']
})
export class GoalPathComponent implements OnInit {

  @ViewChild('closeModald') closeModald: ElementRef;
  
  @ViewChild('closeModal') closeModal: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private courseswitchservice: CourseSwitchService,
    private router: Router,
    private misc: MiscellaneousService,
    private permissions: PermissionsService,
    private scroller: ViewportScroller
  ) { }

  goalId;
  createNew: boolean = false;
  paths;
  learnChapters;
  reviseChapters;
  learnChapterHints;
  reviseChapterHints;
  selectedChapterid;
  showSubjective: boolean = false;
  quesTypes = [];
  includeSubjectiveflag: boolean = true;
  excludeSubjectiveflag: boolean = false;
  ifanydifficulty: boolean = false;
  linkedTypes;
  examId;
  avgtime;
  isAuthenticated = this.permissions.isauthenticated();
  totalQuestions: number = 10;
  totalTime: number = 0;
  questionTypes = [];
  difficulty: number = 5;
  fetchedQuestions;
  paperType = 'practice';
  totalMarks;
  totalusers;
  showTime: boolean = true;
  examDetails;
  submitStatus: boolean = false;
  abcd:boolean = true;
  efgh:boolean = false;
  showForm: boolean = false;
  goalDetails;
  errorMsg;
  selectedPath;
  arrowDown:boolean = true;
  pathCreation:boolean = false;
  pathCreation2:boolean = false;
  activeCard: string = "" ;
  activeCardRevise: string = "";
  pathCounter;
  updatePathButton;
  pathDetails;

  updatePath(id) {
    this.updatePathButton = id;
  }

  showParametersForm() {
    this.showForm = true;
    this.calculateTime(this.totalQuestions);
    if (this.linkedTypes.length >= 1) {
      setTimeout(() => {
        var element = <HTMLInputElement> document.getElementById("customCheck0");
        element.checked = true;
      }, 1000);
      if (this.linkedTypes[0]['is_active']) {
        this.questionTypes.push(this.linkedTypes[0]['type_of_question']);
        this.questionTypes = [...new Set(this.questionTypes.map(m => m))];
      }
    }
  }
 

  hideForm() {
    this.showForm = false;
  }

  @ViewChild('scroll', { read: ElementRef }) public scroll: ElementRef<any>;

  // ngAfterViewChecked() {
  //   this.scrollBottom()
  // }

  public scrollBottom() {
    this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
    this.scroller.scrollToAnchor("target");
  }
  public scrollToTop() {
    this.scroll.nativeElement.scrollTop = 0;
    this.scroller.scrollToAnchor("targetTop");
  }
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

  incQues() {
    this.errorMsg = null;
    if (this.totalQuestions > 200) {
      this.totalQuestions = 200;
      // this.toastr.error('Max 200 questions are allowed!', 'Oops!', {
      //   timeOut: 4000,
      // });
      this.errorMsg = "Max 200 questions are allowed!";
      setTimeout(() => {
        this.errorMsg = null;
      }, 4000);
    }
    this.totalQuestions = this.totalQuestions + 1;
    this.calculateTime(this.totalQuestions);
  }

  decQues() {
    this.errorMsg = null;
    this.totalQuestions = this.totalQuestions - 1;
    if (this.totalQuestions < 0) {
      this.totalQuestions = 0;
    }
    this.calculateTime(this.totalQuestions);
  }

  calculateTime(totalQuestions) {
    this.errorMsg = null;
    console.log("aa", totalQuestions, this.paperType);
    if (totalQuestions > 200) {
      this.totalQuestions = 200;
      totalQuestions = 200;
      this.errorMsg = "Max 200 questions are allowed!";
      // this.toastr.error('Max 200 questions are allowed!', 'Oops!', {
      //   timeOut: 4000,
      // });
      setTimeout(() => {
        this.errorMsg = null;
      }, 4000);
    }
    if (this.totalQuestions < 0) {
      this.totalQuestions = 0;
    }
    //@ts-ignore
    this.totalTime = (totalQuestions * this.avgtime).toFixed(2);
    if (this.totalTime < 0) {
      this.totalTime = 0;
    }
    console.log("totalTime", this.totalTime, this.avgtime);
    // if (this.paperType == 'paper') {
    //   //@ts-ignore
    //   this.totalTime = (totalQuestions * this.avgtime).toFixed(2);
    //   if (this.totalTime < 0) {
    //     this.totalTime = 0;
    //   }
    //   console.log("totalTime", this.totalTime, this.avgtime);
    // }
    // else {
    //   this.totalTime = 0;
    // }
  }

  questionTypeChange(type, event) {
    if(event.target.checked){
      this.questionTypes.push(type);
      this.questionTypes = [...new Set(this.questionTypes.map(m => m))];
    }
    else {
      for (let i = 0; i < this.questionTypes.length; i++) {
        if (this.questionTypes[i] == type) {
          this.questionTypes.splice(i, 1);
        }
      }
      this.questionTypes = [...new Set(this.questionTypes.map(m => m))];
    }
  }

  incTime() {
    this.totalTime = this.totalTime - 1;
    this.totalTime = this.totalTime + 2;
  }

  decTime() {
    this.totalTime = this.totalTime - 1;
    if (this.totalTime < 0) {
      this.totalTime = 0;
    }
  }

  submitPaperForm() {
    this.submitStatus = true;
    if (this.totalQuestions == 0) {
      this.toastr.error('Please enter total number of problems!', 'Oops!', {
        timeOut: 9000,
      });
      this.submitStatus = false;
      return;
    }
    // this.misc.showLoader('short');
    this.abcd=false;
    this.efgh=true;
    let formData;
    
    const LearnerExamData = {
      exam: this.examId
    }
    this.networkRequest.postWithHeader(LearnerExamData, `/api/learnerexam/`)
    .subscribe(
      data => {
        console.log("learner exam linked ", data);
        
        formData = {
          chapters: this.goalDetails['chapters'],
          totalQues: this.totalQuestions,
          totalTime: this.totalTime,
          quesTypes: this.questionTypes,
          difficulty: this.difficulty,
          learnerExam: data['id'],
          exam: this.examId,
          show_time: this.showTime,
          type: 'paper'
        }

        this.networkRequest.putWithHeaders(formData, `/api/filterquestion/`).subscribe(
          data => {
            this.submitStatus = false;
            console.log("Questions found ", data);
            // this.misc.hideLoader();
            this.fetchedQuestions = data['questions'];
            // if (this.fetchedQuestions.length > 0) {
            //   this.toastr.success('Questions found!', 'Found!', {
            //     timeOut: 4000,
            //   });
            // }
            if (this.fetchedQuestions.length == 0) {
              this.toastr.error('No question found!', 'Error!', {
                timeOut: 4000,
              });
              return;
            }
            let quesIds = [];

            this.courseswitchservice.updateReloadPageStatus(true);

            this.router.navigate([`/assessment/paper/test-instructions/${this.examId}`],{
              queryParams: {
                paper: data['id']
              }
            });
            
          },
          error => {
            this.submitStatus = false;
            this.misc.hideLoader();
            console.log("error ", error);
            this.toastr.error(error['error']['message'], 'Error!', {
              timeOut: 4000,
            });
            this.abcd=true;
    this.efgh=false;
          }
        );
      },
      error => {
        this.misc.hideLoader();
        console.log("error in learner exam linking", error);
        this.toastr.error(error['error']['errors'][0], 'Error!', {
          timeOut: 4000,
        });
        this.abcd=true;
    this.efgh=false;
      }
    );
    

  }

  goalExamCreation() {
    const formData = {
      goal: this.goalId
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

  selectAnyRange() {
    this.ifanydifficulty = true;
    let id = "";
    for (let i = 1; i < 4; i++){
      id = "regi" + i;
      document.getElementById(id).classList.remove("selected");
    }
    document.getElementById('allrange').classList.add("selected");
  }

  saveChapterId(id) {
    this.selectedChapterid = id;
    this.selectDifficultyLevel(2, 5);
  }

  selectDifficultyLevel(i, level) {
    this.ifanydifficulty = false;
    this.difficulty = level;
    let id = "";
    for (let i = 1; i < 4; i++){
      id = "regi" + i;
      document.getElementById(id).classList.remove("selected");
    }
    id = "";
    id = "regi" + i;
    document.getElementById(id).classList.add("selected");
    document.getElementById('allrange').classList.remove("selected");
  }

  submitFilterForm() {
    if (this.totalQuestions == 0) {
      this.toastr.error('Please enter total number of problems!', 'Oops!', {
        timeOut: 9000,
      });
      return;
    }
    // this.misc.showLoader('short');
    let chapterIds = [];
    // for (let i = 0; i < this.selectedChapters.length; i++) {
    //   chapterIds.push(this.selectedChapters[i]['id']);
    // }
    chapterIds.push(this.selectedChapterid);
    let formData;
    this.closeModald.nativeElement.click();
    
    const LearnerExamData = {
      exam: this.examId
    }
    this.networkRequest.postWithHeader(LearnerExamData, `/api/learnerexam/`)
    .subscribe(
      data => {
        console.log("learner exam linked ", data);
        formData = {
          chapters: chapterIds,
          totalQues: 10,
          quesTypes: this.quesTypes,
          difficulty: this.difficulty,
          learnerExam: data['id'],
          exam: this.examId,
          show_time: this.showTime,
          type: this.paperType,
          anydifficulty: this.ifanydifficulty
        }
        this.networkRequest.putWithHeaders(formData, `/api/filterquestion/`).subscribe(
          data => {
            console.log("Questions found ", data);
            this.fetchedQuestions = data['questions'];
           
            if (this.fetchedQuestions.length == 0) {
              this.toastr.error('No question found!', 'Error!', {
                timeOut: 4000,
              });
              return;
            }

            this.courseswitchservice.updateReloadPageStatus(true);

            this.router.navigate([`/assessment/paper/practice-paper/${this.examId}`],{
              queryParams: {
                paper: data['id']
              }
            });
            
          },
          error => {
            this.misc.hideLoader();
            console.log("error ", error);
            this.toastr.error(error['error']['message'], 'Error!', {
              timeOut: 4000,
            });
          }
        );
      },
      error => {
        this.misc.hideLoader();
        console.log("error in learner exam linking", error);
        this.toastr.error(error['error']['errors'][0], 'Error!', {
          timeOut: 4000,
        });
      }
    );
    

  }

  includeSubjective(event) {
    if(event.target.checked){
      this.quesTypes.push('subjective');
    }
    else {
      this.excludeSubjective();
    }
  }

  excludeSubjective() {
    for (let i = 0; i < this.quesTypes.length; i++) {
      if (this.quesTypes[i] == "subjective") {
        this.quesTypes.splice(i, 1);
      }
    }
  }

  includeObjective(event) {
    if(event.target.checked){
      for (let i = 0; i < this.linkedTypes.length; i++) {
        if (this.linkedTypes[i]['type_of_question'] != 'subjective') {
          this.quesTypes.push(this.linkedTypes[i]['type_of_question']);
        }
      }
      this.quesTypes = [...new Set(this.quesTypes.map(m => m))];
    }
    else {
      this.excludeObjective();
    }
  }

  excludeObjective() {
    for (let i = 0; i < this.quesTypes.length; i++) {
      if (this.quesTypes[i] != "subjective") {
        this.quesTypes.splice(i, 1);
      }
    }
  }

  selectPath(id, counter) {
    this.selectedPath = id;
    this.pathCounter = counter;
    this.networkRequest.getWithHeaders(`/api/fetchpathlearnchapters/?path=${id}`).subscribe(
      data => {
        console.log("learn chapters ", data);
        this.learnChapters = data;
        this.fetchLearnTopics(this.learnChapters[0]['id']);
      },
      error => {
        console.log("error ", error);
      }
    );

    this.networkRequest.getWithHeaders(`/api/fetchpathrevisechapters/?path=${id}`).subscribe(
      data => {
        console.log("revise chapters ", data);
        this.reviseChapters = data;
        this.fetchReviseTopics(this.reviseChapters[0]['id']);
      },
      error => {
        console.log("error ", error);
      }
    );
    this.updatePathPercentage();
  }

  updatePathPercentage() {
    const formData = {
      path: this.selectedPath
    }
    this.networkRequest.putWithHeaders(formData, `/api/learnergoalpathpercentage/`).subscribe(
      data => {
        console.log("learnergoalpathpercentage ", data);
        this.networkRequest.getWithHeaders(`/api/path/${this.selectedPath}/`).subscribe(
          data => {
            console.log("path details ", data);
            this.pathDetails = data;
          },
          error => {
            console.log("error ", error);
          }
        );
      },
      error => {
        console.log("error", error);
      }
    )
  }

  fetchLearnTopics(id) {
    if (this.activeCard == id) {
      this.activeCard = null;
   }
   else{
     this.activeCard = id;
   }
    this.learnChapterHints = null;
    this.networkRequest.getWithHeaders(`/api/fetchpathlearnchapterhints/?learn_chapter=${id}`).subscribe(
      data => {
        console.log("learn chapters hints", data);
        this.learnChapterHints = data;
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  fetchReviseTopics(id) {
    if (this.activeCardRevise == id) {
      this.activeCardRevise = null;
   }
   else{
     this.activeCardRevise = id;
   }
    this.learnChapterHints = null;
    this.networkRequest.getWithHeaders(`/api/fetchpathrevisechapterhints/?revise_chapter=${id}`).subscribe(
      data => {
        console.log("revise chapters hints", data);
        this.reviseChapterHints = data;
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  updateLearnHint(id, status, learn_chaper) {
    const formData = {
      learnhint: id,
      check: status
    }

    this.networkRequest.putWithHeaders(formData, `/api/updatelearnchapterhints/`)
    .subscribe(
      data => {
        console.log("topic updated ", data);
        this.toastr.success('Status updated!', 'Done!', {
          timeOut: 4000,
        });
        this.createNew = false;
        this.fetchLearnTopics(learn_chaper);
        this.updatePercentage();
        this.updatePathPercentage();
      },
      error => {
        console.log("error", error);
        this.toastr.error(error['error']['detail'], 'Error!', {
          timeOut: 4000,
        });
      }
    );
  }

  updateReviseHint(id, status, revise_chaper) {
    const formData = {
      revisehint: id,
      check: status
    }

    this.networkRequest.putWithHeaders(formData, `/api/updaterevisechapterhints/`)
    .subscribe(
      data => {
        console.log("topic updated ", data);
        this.toastr.success('Status updated!', 'Done!', {
          timeOut: 4000,
        });
        this.createNew = false;
        this.fetchReviseTopics(revise_chaper);
        this.updatePercentage();
        this.updatePathPercentage();
      },
      error => {
        console.log("error", error);
        this.toastr.error(error['error']['detail'], 'Error!', {
          timeOut: 4000,
        });
      }
    );
  }

  createNewPath() {
    // var confirmation = confirm("Are you sure you want to update this path?");
    // if (confirmation) {
      this.createNew = true;
      this.pathCreation = true;
      this.closeModal.nativeElement.click();
      const formData = {
        goal: this.goalId
      }
      this.networkRequest.putWithHeaders(formData, `/api/checkforsubsequentpathcreation/`).subscribe(
        data => {
          console.log("check subsequent path ", data);
          if (!data) {
            this.networkRequest.putWithHeaders(formData, `/api/checkforsubsequentpathcreation/`).subscribe(
              data => {
                console.log("check subsequent path ", data);
                if (data['status'] == 1) {
                  this.generateGoalPath();
                }
                else {
                  this.pathCreation = false;
                  this.toastr.error(data['message'], 'Error!', {
                    timeOut: 4000,
                    
                  });
                }
              },
              error => {
              }
            )
            return;
          }
          if (data['status'] == 1) {
            this.generateGoalPath();
            // this.toastr.success(data['message'], 'Success!', {
            //   timeOut: 4000,
            // });
          }
          else {
            this.pathCreation = false;
            this.toastr.error(data['message'], 'Error!', {
              timeOut: 4000,
            });
          }
        },
        error => {
        }
      )
    // }
  }

  createPathAssessment() {
    // var confirmation = confirm("Are you sure you want to update this path?");
    // if (confirmation) {
      this.createNew = true;
      this.pathCreation2 = true;
      this.closeModal.nativeElement.click();
      const formData = {
        goal: this.goalId
      }
      this.networkRequest.putWithHeaders(formData, `/api/checkforsubsequentpathcreation/`).subscribe(
        data => {
          console.log("check subsequent path ", data);
          if (!data) {
            this.networkRequest.putWithHeaders(formData, `/api/checkforsubsequentpathcreation/`).subscribe(
              data => {
                if (data['status'] == 1) {
                  this.generatePaper();
                }
                else {
                  this.pathCreation2 = false;
                  this.toastr.error(data['message'], 'Error!', {
                    timeOut: 4000,
                  });
                }
              },
              error => {
              }
            )
            return;
          }
          if (data['status'] == 1) {
            this.generatePaper();
            // this.toastr.success(data['message'], 'Success!', {
            //   timeOut: 4000,
            // });
          }
          else {
            this.pathCreation2 = false;
            this.toastr.error(data['message'], 'Error!', {
              timeOut: 4000,
            });
          }
        },
        error => {
        }
      )
    // }
  }

  generatePaper() {
    console.log("quesTypes", this.quesTypes);
    const formData = {
      goal: this.goalId,
      quesTypes: this.quesTypes,
      difficulty: 5,
      exam: this.examId
    }
    this.networkRequest.putWithHeaders(formData, `/api/updatepathassessment/`).subscribe(
      data => {
        this.submitStatus = false;
        console.log("Questions found ", data);
        this.fetchedQuestions = data['questions'];
       
        if (this.fetchedQuestions.length == 0) {
          this.toastr.error('No question found!', 'Error!', {
            timeOut: 4000,
          });
          return;
        }

        this.courseswitchservice.updateReloadPageStatus(true);

        this.router.navigate([`/assessment/paper/test-instructions/${this.examId}`],{
          queryParams: {
            paper: data['id']
          }
        });
        
      },
      error => {
        this.submitStatus = false;
        this.misc.hideLoader();
        console.log("error ", error);
        this.toastr.error(error['error']['message'], 'Error!', {
          timeOut: 4000,
        });
        this.abcd=true;
this.efgh=false;
      }
    );
  }

  generateGoalPath() {
    const formData = {
      goal: this.goalId,
      new: this.createNew
    }

    this.networkRequest.putWithHeaders(formData, `/api/learnergoalpathcreate/`)
    .subscribe(
      data => {
        console.log("path generated ", data);
        this.createNew = false;
        this.fetchPaths();
        this.pathCreation = false;
      },
      error => {
        console.log("error creating path", error);
        this.pathCreation = false;
      }
    );
    
  }

  fetchGoalDetails() {
    this.networkRequest.getWithHeaders(`/api/learnerexamgoals/${this.goalId}/`).subscribe(
      data => {
        this.goalDetails = data;
        console.log("Goal details ", data);
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

  updatePercentage() {
    const formData = {
      goal: this.goalId
    }
    this.networkRequest.putWithHeaders(formData, `/api/learnergoalpercentage/`).subscribe(
      data => {
        console.log("learnergoalpercentage ", data);
      },
      error => {
        console.log("error", error);
      }
    )
  }

  fetchPaths() {
    let tempPaths = [];
    this.networkRequest.getWithHeaders(`/api/fetchlearnergoalpaths/?goal=${this.goalId}`).subscribe(
      data => {
        console.log("Goal paths ", data);
        this.paths = data;
        tempPaths = this.paths;
        tempPaths.sort((a, b) => (a.counter - b.counter));
        this.paths = this.paths.reverse();
        if (this.paths.length > 0) {
          console.log("paths[0]['id']", this.paths[0]['id']);
          this.selectPath(this.paths[0]['id'], this.paths[0]['counter']);
          if (tempPaths[0]['paper'] && tempPaths[0]['paper']['submitted']) {
            this.createNew = true;
            this.pathCreation = true;
            const formData = {
              goal: this.goalId
            }
            this.networkRequest.putWithHeaders(formData, `/api/checkforsubsequentpathcreation/`).subscribe(
              data => {
                console.log("check subsequent path ", data);
                if (data['status'] == 1) {
                  this.generateGoalPath();
                  // this.toastr.success(data['message'], 'Success!', {
                  //   timeOut: 4000,
                  // });
                }
                else {
                  this.toastr.error(data['message'], 'Error!', {
                    timeOut: 4000,
                  });
                }
              },
              error => {
              }
            )
          }
        }
        else {
          const formData = {
            goal: this.goalId
          }
          this.networkRequest.putWithHeaders(formData, `/api/checkforfirstpathcreation/`).subscribe(
            data => {
              console.log("check first path ", data);
              if (data['status'] == 1) {
                this.generateGoalPath();
                // this.toastr.success(data['message'], 'Success!', {
                //   timeOut: 4000,
                // });
              }
              else {
                this.toastr.error(data['message'], 'Error!', {
                  timeOut: 4000,
                });
              }
            },
            error => {
            }
          )
          
        }
      },
      error => {
        console.log("error ", error);
      }
    );
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
      
    this.networkRequest.getWithHeaders(`/api/examquestionaveragetime/?exam=${this.examId}`)
    .subscribe(
      data => {
        console.log("avg details ", data);
        this.avgtime = data[0]['time'];
      },
      error => {
      });
    this.networkRequest.getWithHeaders(`/api/examlinkedquestiontypes/?exam=${this.examId}`)
    .subscribe(
      data => {
        console.log("linked types ", data);
        this.linkedTypes = data;
        for (let i = 0; i < this.linkedTypes.length; i++) {
          this.quesTypes.push(this.linkedTypes[i]['type_of_question']);
        }
        this.quesTypes = [...new Set(this.quesTypes.map(m => m))];
        console.log("quesTypes", this.quesTypes);
        if (this.quesTypes.includes('subjective')) {
          this.showSubjective = true;
          this.excludeSubjective();
          setTimeout(() => {
            var element = <HTMLInputElement> document.getElementById('customCheck');
            element.checked = true;
            // var element2 = <HTMLInputElement> document.getElementById('customCheckSecond');
            // element2.checked = true;
          }, 1000);
        }
        this.linkedTypes.sort(function(a, b){  
          var sortingArr = ['mcq', 'mcc', 'boolean', 'fillup', 'fillup_option', 'assertion', 'numerical', 'subjective'];
          return sortingArr.indexOf(a.type_of_question) - sortingArr.indexOf(b.type_of_question);
        });
      },
      error => {
      });
    }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.examId = params.exam;
        if (this.examId) {
          this.courseswitchservice.updateExamId(this.examId);
          this.getExamDetails();
        }
        else {
          this.getExamDetails();
        }
    });

    this.route.params.subscribe(
      data1 => {
        if (data1['goal']) {
          this.goalId = data1['goal'];
          this.fetchPaths();
          this.fetchGoalDetails();
          this.updatePercentage();
        }
      }
    );

  }

}
