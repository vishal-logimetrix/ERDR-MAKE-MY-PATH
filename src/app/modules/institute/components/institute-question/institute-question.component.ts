import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-institute-question',
  templateUrl: './institute-question.component.html',
  styleUrls: ['./institute-question.component.scss']
})
export class InstituteQuestionComponent implements OnInit {
  subjects: string[] = ['helo 2','helo 2','helo 6','helo 8','helo 2','helo 2','helo 6','helo 8'];
  show: boolean = true;
  active: boolean = true;
  verified: boolean = true;

  question=[];

  @ViewChild('closeModalTag') closeModalTag: ElementRef;

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
  tag: any;
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
  selectedtags = [];
  deletetag;
  mcqQuestions;
  mccQuestions;
  fillupQuestions;
  subjectiveQues;
  numericalQues;
  assertionQues;
  booleanQues;
  fillup_optionQues;
  orderby= '';

  activateDeactivateQuestions(id, status) {
    var questionData = {
      id: id,
      is_active: status
    };
    console.log("status", status);
    
    this.networkRequest.putWithHeaders(questionData, `/api/activate_deactivate_question/`).subscribe(
      data => {
        console.log("Question successfully updated ", data);
        // this.toastr.success('Difficulty, tags, active status updated successfully!', 'Updated!', {
        //   timeOut: 4000,
        // });
        this.goToPage(this.currentPage);
      },
      error => {
        console.log("error ", error);
        this.toastr.error('Some error while updating quesion features!', 'Error!', {
          timeOut: 4000,
        });
      }
    );
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(text => text.length < 2 ? []
        : this.options.filter(v => v.toLowerCase().indexOf(text.toLowerCase()) > -1).slice(0, 10))
  )

  removeTag(id) {
    this.selectedtag = null;
  }

  removeTagsDelete(id) {
    for (let i = 0; i < this.selectedtags.length; i++) {
      if (this.selectedtags[i]['id'] == id) {
        this.selectedtags.splice(i, 1);
      }
    }
  }

  fetchAndSelectMultipleTags() {
    var tagArray = [];
    this.selectedtags = [];
    var sendTags = [];
    tagArray = this.deletetag.split(' ');
    for (let i = 0; i < tagArray.length; i++) {
      sendTags.push(tagArray[i].trim());
      if (i == tagArray.length - 1) {
        const formData = {
          ftags: sendTags
        }
        this.networkRequest.putWithHeaders(formData, `/api/searchmultiplefiltertag/`).subscribe(
          data => {
            console.log("ftags ", data);
            this.searchIcon = false;
            //@ts-ignore
            this.selectedtags = data;
          },
          error => {
            //"Error section")
            this.errors = error['message'];
            //"error msg", this.errors);
          }
        )
      }
    }
  }

  deleteTag() {
    let tagIds = [];
    for (let i = 0; i < this.selectedtags.length; i++) {
      tagIds.push(this.selectedtags[i]['id']);
    }

    const formData = {
      topics: tagIds
    }
    console.log("formData ", formData);
    this.networkRequest.putWithHeaders(formData, `/api/bulkftagdelete/`)
    .subscribe(
      data => {
        console.log("Ftags deleted ", data);
        this.toastr.success('Ftags successfully deleted!', 'Deleted!', {
          timeOut: 4000,
        });
        this.selectedtags = [];
        this.deletetag = null;
        this.closeModalTag.nativeElement.click();
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  detectTag(obj: any) {
    this.searchIcon = false;
    let array1 = [];
    // const objdata = {
    //   text: obj.target.value,
    // }

    let text = obj.target.value

    this.networkRequest.getWithHeaders(`/api/searchfiltertag/?text=${text}`).subscribe(
      data => {
        console.log("tags ", data);
        this.searchIcon = false;
        // @ts-ignore
        data.map((item) => {
          array1.push(item['title'])
        })
        this.options = array1
        // @ts-ignore
        this.TagData = data;
      },
      error => {
        //"Error section")
        this.errors = error['message'];
        //"error msg", this.errors);
        this.viewDetailbutton = false;
        this.searchIcon = true;
      }
    )
    if (this.options.length == 0 || obj.target.value.length < 2){
      document.getElementById("typeahead-basic").classList.remove("input-field-radius");
      this.viewDetailbutton = false;
      this.searchIcon = true;
    }
    else {
      document.getElementById("typeahead-basic").classList.add("input-field-radius");
      this.viewDetailbutton = true;
      this.searchIcon = false;
    }
    
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  goToPage(pageIndex) {
    this.currentPage = pageIndex;
    this.fetchQuesCount();
    this.networkRequest.getWithHeaders(`/api/fetchquestionstagwise/?topic=${this.selectedtag['id']}&page=${this.currentPage}&order=${this.orderby}`)
      .subscribe(
        data => {
          console.log("questions ", data);
          this.questions = data['results'];
          let page_size = data['page_size'];
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
  
  selectFilter(event) {
    this.orderby = event.target.value;
    this.currentPage = 1;
    this.goToPage(this.currentPage);
  }

  TagFilter() {
    let filtered = [];
    for (let i = 0; i < this.TagData.length; i++) {
      if (this.TagData[i].title == this.tag) {
        console.log("tagaaaa", this.TagData[i], this.tag)
        filtered.push(this.TagData[i]);
        this.successFlag = true;
      }
    }
    this.selectedtag = filtered[0];
    this.currentPage = 1;
    this.fetchQuesCount();
    this.networkRequest.getWithHeaders(`/api/fetchquestionstagwise/?topic=${this.selectedtag['id']}&page=${this.currentPage}&order=${this.orderby}`)
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

  fetchQuesCount() {
    this.networkRequest.putWithHeaders('',`/api/questionscounttypetagwise/?topic=${this.selectedtag['id']}&type=mcq`)
      .subscribe(
        data => {
          console.log("mcq questions ", data);
          this.mcqQuestions = data['count'];
        },
        error => {
          console.log("error ", error);
        }
      );
    this.networkRequest.putWithHeaders('',`/api/questionscounttypetagwise/?topic=${this.selectedtag['id']}&type=mcc`)
    .subscribe(
      data => {
        console.log("mcc questions ", data);
        this.mccQuestions = data['count'];
      },
      error => {
        console.log("error ", error);
      }
    );
    this.networkRequest.putWithHeaders('',`/api/questionscounttypetagwise/?topic=${this.selectedtag['id']}&type=fillup`)
      .subscribe(
        data => {
          console.log("fillup questions ", data);
          this.fillupQuestions = data['count'];
        },
        error => {
          console.log("error ", error);
        }
      );
    this.networkRequest.putWithHeaders('',`/api/questionscounttypetagwise/?topic=${this.selectedtag['id']}&type=subjective`)
    .subscribe(
      data => {
        console.log("subjective questions ", data);
        this.subjectiveQues = data['count'];
      },
      error => {
        console.log("error ", error);
      }
    );
    this.networkRequest.putWithHeaders('',`/api/questionscounttypetagwise/?topic=${this.selectedtag['id']}&type=numerical`)
    .subscribe(
      data => {
        console.log("numerical questions ", data);
        this.numericalQues = data['count'];
      },
      error => {
        console.log("error ", error);
      }
    );
    this.networkRequest.putWithHeaders('',`/api/questionscounttypetagwise/?topic=${this.selectedtag['id']}&type=assertion`)
    .subscribe(
      data => {
        console.log("assertion questions ", data);
        this.assertionQues = data['count'];
      },
      error => {
        console.log("error ", error);
      }
    );
    this.networkRequest.putWithHeaders('',`/api/questionscounttypetagwise/?topic=${this.selectedtag['id']}&type=boolean`)
    .subscribe(
      data => {
        console.log("boolean questions ", data);
        this.booleanQues = data['count'];
      },
      error => {
        console.log("error ", error);
      }
    );
    this.networkRequest.putWithHeaders('',`/api/questionscounttypetagwise/?topic=${this.selectedtag['id']}&type=fillup_option`)
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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  detectTagParam(tag: any) {
    this.searchIcon = false;
    let array1 = [];
    // const objdata = {
    //   text: obj.target.value,
    // }

    let text = tag;

    this.networkRequest.getWithHeaders(`/api/searchfiltertag/?text=${text}`).subscribe(
      data => {
        console.log("tags ", data);
        this.searchIcon = false;
        // @ts-ignore
        data.map((item) => {
          array1.push(item['title'])
        })
        this.options = array1
        // @ts-ignore
        this.TagData = data;
        this.TagFilter();
      },
      error => {
        //"Error section")
        this.errors = error['message'];
        //"error msg", this.errors);
        this.viewDetailbutton = false;
        this.searchIcon = true;
      }
    )
    if (this.options.length == 0 || tag.length < 2){
      document.getElementById("typeahead-basic").classList.remove("input-field-radius");
      this.viewDetailbutton = false;
      this.searchIcon = true;
    }
    else {
      document.getElementById("typeahead-basic").classList.add("input-field-radius");
      this.viewDetailbutton = true;
      this.searchIcon = false;
    }
    
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  ngOnInit(): void {
    // console.log("aa");
    this.route.queryParams.subscribe(
      data1 => {
        // console.log("dtaa", data1['tag']);
        if (data1['tag']) {
          setTimeout(() => {
            this.tag = data1['tag'];
            this.detectTagParam(this.tag);
          }, 700);
          
        }
      }
    );
  }
  

}
