import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-topic-concepts',
  templateUrl: './topic-concepts.component.html',
  styleUrls: ['./topic-concepts.component.scss']
})
export class TopicConceptsComponent implements OnInit {

  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModalEdit') closeModalEdit: ElementRef;
  @ViewChild('closeModalTag') closeModalTag: ElementRef;
  @ViewChild('closeModalHint') closeModalHint: ElementRef;

constructor(
  private router: Router,
  private route: ActivatedRoute,
  private networkRequest: NetworkRequestService,
  private fb: FormBuilder,
  private toastr: ToastrService
) { }

title;
description;
editTitle;
editdescription;
chapterId;
hints;
selectedHint;
myControl = new FormControl();
options: string[] = [];
filteredOptions: Observable<string[]>;
tag: any;
selectedtags = [];
mycontent: string;
log: string = '';
searchIcon;
errors = null;
viewDetailbutton = false;
successFlag = false;
TagData;
hintTitle;
order;
editOrder;
show: boolean = true;
editShow: boolean = true;
allrange = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
bloom;
editbloom;
difficulty;
importance;
learningTime;
practiceTime;
revisionImportance;
editdifficulty;
editimportance;
editlearningTime;
editpracticeTime;
editrevisionImportance;
bloomlevels;


search = (text$: Observable<string>) =>
text$.pipe(
  debounceTime(200),
  distinctUntilChanged(),
  map(text => text.length < 2 ? []
    : this.options.filter(v => v.toLowerCase().indexOf(text.toLowerCase()) > -1).slice(0, 10))
)

removeTag(id) {
for (let i = 0; i < this.selectedtags.length; i++) {
  if (this.selectedtags[i]['id'] == id) {
    this.selectedtags.splice(i, 1);
  }
}
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
      console.log("ftags ", data);
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

fetchAndSelectMultipleTags() {
  var tagArray = [];
  this.selectedtags = [];
  var sendTags = [];
  tagArray = this.tag.split(' ');
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
  // for (let i = 0; i < tagArray.length; i++) {
  //   this.networkRequest.getWithHeaders(`/api/searchfiltertag/?text=${tagArray[i]}`).subscribe(
  //     data => {
  //       console.log("ftags ", data);
  //       this.searchIcon = false;
  //       this.selectedtags.push(data[0]);
  //     },
  //     error => {
  //       //"Error section")
  //       this.errors = error['message'];
  //       //"error msg", this.errors);
  //     }
  //   )
  // }
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
  this.selectedtags.push(filtered[0]);

  if (this.successFlag == true) {
  }
}

private _filter(value: string): string[] {
  const filterValue = value.toLowerCase();

  return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
}

removeHintFromChapter(hintId) {
  var confirmation = confirm("Are you sure you want to delete this Concept?");
  if (confirmation){
    this.networkRequest.delete(`/api/hintconcept/${hintId}/`)
    .subscribe(
      data => {
        console.log("Topic updated ", data);
        this.toastr.success('Concept successfully removed from the Topic!', 'Updated!', {
          timeOut: 4000,
        });
        this.getHints();
      },
      error => {
        console.log("error ", error);
      }
    );
  }
}

submitHintConcept() {
  const formData = {
    hint: this.selectedHint.id,
    title: this.hintTitle
  }
  console.log("formData ", formData);
  this.networkRequest.postWithHeader(formData, `/api/hintconcept/`)
  .subscribe(
    data => {
      console.log("Chapter topic created ", data);
      this.toastr.success('Chapter topic created successfully!', 'Updated!', {
        timeOut: 4000,
      });
      this.editTitle = null;
      this.hintTitle = null;
      this.selectedHint = null;
      this.selectedtags = [];
      this.tag = null;
      this.getHints();
      this.closeModalHint.nativeElement.click();
    },
    error => {
      console.log("error ", error);
    }
  );
}

assignTag() {
  let tagIds = [];
  for (let i = 0; i < this.selectedtags.length; i++) {
    tagIds.push(this.selectedtags[i]['id']);
  }

  const formData = {
    topics: tagIds
  }
  console.log("formData ", formData);
  this.networkRequest.putWithHeaders(formData, `/api/addftagchapter/${this.selectedHint['id']}/`)
  .subscribe(
    data => {
      console.log("Chapter updated ", data);
      this.toastr.success('Chapter updated successfully!', 'Updated!', {
        timeOut: 4000,
      });
      this.editTitle = null;
      this.selectedHint = null;
      this.selectedtags = [];
      this.tag = null;
      this.getHints();
      this.closeModalTag.nativeElement.click();
    },
    error => {
      console.log("error ", error);
    }
  );
}

fetchDetails(id) {
  this.networkRequest.getWithHeaders(`/api/chapterhintdetail/${id}/`)
  .subscribe(
    data => {
      console.log("chapter details ", data);
      this.selectedHint = data;
      this.editTitle = this.selectedHint['title'];
      this.editbloom = this.selectedHint['bloom_level'],
      this.editdifficulty = this.selectedHint['difficulty'];
      this.editimportance = this.selectedHint['importance'];
      this.editlearningTime = this.selectedHint['learning_time'];
      this.editpracticeTime = this.selectedHint['practice_time'];
      this.editrevisionImportance = this.selectedHint['revision_importance'];
      this.editShow = this.selectedHint['show'];
    },
    error => {
    });

    // this.networkRequest.getWithHeaders(`/api/fetchquestionschapterwise/?chapter=${id}`)
    // .subscribe(
    //   data => {
    //     console.log("chapter master tag questions ", data);
    //   },
    //   error => {
    //   });
}

submit() {
  const formData = {
    title: this.title,
    chapter: this.chapterId,
    bloom_level: this.bloom,
    difficulty: this.difficulty,
    importance: this.importance,
    learning_time: this.learningTime,
    practice_time: this.practiceTime,
    revision_importance: this.revisionImportance,
    show: this.show
  }
  this.networkRequest.postWithHeader(formData, `/api/chapterhint/`)
  .subscribe(
    data => {
      console.log("chapter topic created ", data);
      this.toastr.success('Chapter topic created successfully!', 'Created!', {
        timeOut: 4000,
      });
      this.title = null;
      this.description = null;
      this.closeModal.nativeElement.click();
      this.getHints();
    },
    error => {
      console.log("error ", error);
    }
  );
}

edit() {
  const formData = {
    title: this.editTitle,
    chapter: this.chapterId,
    bloom_level: this.editbloom,
    difficulty: this.editdifficulty,
    importance: this.editimportance,
    learning_time: this.editlearningTime,
    practice_time: this.editpracticeTime,
    revision_importance: this.editrevisionImportance,
    show: this.editShow
  }
  this.networkRequest.putWithHeaders(formData, `/api/chapterhint/${this.selectedHint['id']}/`)
  .subscribe(
    data => {
      console.log("Chapter updated ", data);
      this.toastr.success('Chapter updated successfully!', 'Updated!', {
        timeOut: 4000,
      });
      this.editTitle = null;
      this.selectedHint = null;
      this.editdescription = null;
      this.editOrder = null;
      this.closeModalEdit.nativeElement.click();
      this.getHints();
    },
    error => {
      console.log("error ", error);
    }
  );
}

getHints() {
  this.networkRequest.getWithHeaders(`/api/chapterallhints/?chapter=${this.chapterId}`)
    .subscribe(
      data => {
        console.log("chapter hints", data);
        this.hints = data;
      },
      error => {
        console.log("error ", error);
      }
    );
}

getChapterDetails() {
  this.networkRequest.getWithHeaders(`/api/chapter/${this.chapterId}/`)
  .subscribe(
    data => {
      console.log("chapter details ", data);
    },
    error => {
    });

  this.networkRequest.getWithHeaders(`/api/bloomlevel/`)
  .subscribe(
    data => {
      this.bloomlevels = data;
      console.log("bloom levels ", data);
    },
    error => {
    });
}

ngOnInit(): void {
  this.route.queryParams.subscribe(
    params => {
      this.chapterId = params.id;
      if (this.chapterId) {
        this.getChapterDetails();
        this.getHints();
      }
  });
}

}
