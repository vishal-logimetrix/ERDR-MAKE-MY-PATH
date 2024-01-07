import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-chapter-questions',
  templateUrl: './chapter-questions.component.html',
  styleUrls: ['./chapter-questions.component.scss']
})
export class ChapterQuestionsComponent implements OnInit {

  subjects: string[] = ['helo 2','helo 2','helo 6','helo 8','helo 2','helo 2','helo 6','helo 8'];
  show: boolean = true;
  active: boolean = true;
  verified: boolean = true;

  question=[];

  constructor(
    private router: Router,
    private networkRequest: NetworkRequestService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  chapter: any;
  selectedtag;
  languages;
  searchIcon;
  errors = null;
  viewDetailbutton = false;
  successFlag = false;
  TagData;
  tags;
  questions;
  links;
  max_page: number;
  pages = [];
  currentPage: number;
  startPage: number = 1;
  endPage: number = 1;
  totalQuestions;
  mcqQuestions;
  mccQuestions;
  fillupQuestions;
  subjectiveQues;
  numericalQues;
  assertionQues;
  booleanQues;
  fillup_optionQues;

  fetchQuesCount() {
    this.networkRequest.putWithHeaders('',`/api/questionscounttypemastertagwise/?chapter=${this.chapter}&type=mcq`)
      .subscribe(
        data => {
          console.log("mcq questions ", data);
          this.mcqQuestions = data['count'];
        },
        error => {
          console.log("error ", error);
        }
      );
    this.networkRequest.putWithHeaders('',`/api/questionscounttypemastertagwise/?chapter=${this.chapter}&type=mcc`)
    .subscribe(
      data => {
        console.log("mcc questions ", data);
        this.mccQuestions = data['count'];
      },
      error => {
        console.log("error ", error);
      }
    );
    this.networkRequest.putWithHeaders('',`/api/questionscounttypemastertagwise/?chapter=${this.chapter}&type=fillup`)
      .subscribe(
        data => {
          console.log("fillup questions ", data);
          this.fillupQuestions = data['count'];
        },
        error => {
          console.log("error ", error);
        }
      );
    this.networkRequest.putWithHeaders('',`/api/questionscounttypemastertagwise/?chapter=${this.chapter}&type=subjective`)
    .subscribe(
      data => {
        console.log("subjective questions ", data);
        this.subjectiveQues = data['count'];
      },
      error => {
        console.log("error ", error);
      }
    );
    this.networkRequest.putWithHeaders('',`/api/questionscounttypemastertagwise/?chapter=${this.chapter}&type=numerical`)
    .subscribe(
      data => {
        console.log("numerical questions ", data);
        this.numericalQues = data['count'];
      },
      error => {
        console.log("error ", error);
      }
    );
    this.networkRequest.putWithHeaders('',`/api/questionscounttypemastertagwise/?chapter=${this.chapter}&type=assertion`)
    .subscribe(
      data => {
        console.log("assertion questions ", data);
        this.assertionQues = data['count'];
      },
      error => {
        console.log("error ", error);
      }
    );
    this.networkRequest.putWithHeaders('',`/api/questionscounttypemastertagwise/?chapter=${this.chapter}&type=boolean`)
    .subscribe(
      data => {
        console.log("boolean questions ", data);
        this.booleanQues = data['count'];
      },
      error => {
        console.log("error ", error);
      }
    );
    this.networkRequest.putWithHeaders('',`/api/questionscounttypemastertagwise/?chapter=${this.chapter}&type=fillup_option`)
    .subscribe(
      data => {
        console.log("fillup_option questions ", data);
        this.fillup_optionQues = data['count'];
      },
      error => {
        console.log("error ", error);
      }
    );
  }


  goToPage(pageIndex) {
    this.currentPage = pageIndex;
    this.networkRequest.getWithHeaders(`/api/fetchquestionschapterwise/?chapter=${this.chapter}&page=${this.currentPage}`)
      .subscribe(
        data => {
          console.log("questions ", data);
          this.questions = data['results'];
          let page_size = data['page_size'];
          this.totalQuestions = data['count'];
          this.links = data['links'];
          if (data['count'] % page_size === 0) {
            this.max_page = Math.floor(data['count'] / page_size);
          } else {
            this.max_page = Math.floor(data['count'] / page_size) + 1;
          }
          this.pages = ' '.repeat(this.max_page).split('');
          if (this.max_page < 11) {
            // less than 10 total pages so show all
            this.startPage = 1;
            this.endPage = this.max_page;
          } else if (this.currentPage < 6) {
            this.startPage = 1;
            this.endPage = 10;
          } else if (this.currentPage >= 6 && this.currentPage < this.max_page - 5) {
            this.startPage = this.currentPage - 4;
            this.endPage = this.currentPage - (-5);
          } else {
            this.startPage = this.max_page - 9;
            this.endPage = this.max_page;
          }
        },
        error => {
          console.log("error ", error);
        }
      );
  }


  ngOnInit(): void {
    console.log("aa");
    this.route.queryParams.subscribe(
      data1 => {
        console.log("dta", data1);
        if (data1['chapter']) {
          this.chapter = data1['chapter'];
          this.currentPage = 1;
          this.goToPage(this.currentPage);
          this.fetchQuesCount();
        }
      }
    );
  }

}
