import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-create-chapter',
  templateUrl: './create-chapter.component.html',
  styleUrls: ['./create-chapter.component.scss']
})
export class CreateChapterComponent implements OnInit {

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
subjectId;
chapters;
selectedSubject;
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

  var confirmation = confirm("Are you sure you want to delete this Topic?");
  if (confirmation){
    this.networkRequest.delete(`/api/chapterhint/${hintId}/`)
    .subscribe(
      data => {
        console.log("Chapter updated ", data);
        this.toastr.success('Topic successfully removed from the chapter!', 'Updated!', {
          timeOut: 4000,
        });
        this.getChapters();
      },
      error => {
        console.log("error ", error);
      }
    );
  }
}

removeFTagFromChapter(chapterId, ftagId) {

  const formData = {
    topic: ftagId
  }
  console.log("formData ", formData);
  var confirmation = confirm("Are you sure you want to delete this FTag?");
  if (confirmation){
    this.networkRequest.putWithHeaders(formData, `/api/removeftagchapter/${chapterId}/`)
    .subscribe(
      data => {
        console.log("Chapter updated ", data);
        this.toastr.success('FTag successfully removed from the chapter!', 'Updated!', {
          timeOut: 4000,
        });
        this.getChapters();
        this.syncTag(chapterId);
      },
      error => {
        console.log("error ", error);
      }
    );
  }
}

submitHint() {
  const formData = {
    chapter: this.selectedSubject.id,
    title: this.hintTitle
  }
  console.log("formData ", formData);
  this.networkRequest.postWithHeader(formData, `/api/chapterhint/`)
  .subscribe(
    data => {
      console.log("Chapter topic created ", data);
      this.toastr.success('Chapter topic created successfully!', 'Updated!', {
        timeOut: 4000,
      });
      this.editTitle = null;
      this.hintTitle = null;
      this.selectedSubject = null;
      this.selectedtags = [];
      this.tag = null;
      this.getChapters();
      this.closeModalHint.nativeElement.click();
    },
    error => {
      console.log("error ", error);
    }
  );
}

syncTag(id) {
  const formData = {
    chapter: id
  }
  console.log("formData ", formData);
  this.networkRequest.putWithHeaders(formData, `/api/synctag/`)
  .subscribe(
    data => {
      console.log("Chapter master tag updated ", data);
      this.toastr.success('Chapter Master Tag updated successfully!', 'Updated!', {
        timeOut: 4000,
      });
      this.editTitle = null;
      this.selectedSubject = null;
      this.selectedtags = [];
      this.tag = null;
      this.closeModalTag.nativeElement.click();
    },
    error => {
      console.log("error ", error);
      this.toastr.error(error['error']['message'], 'Error!', {
        timeOut: 4000,
      });
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
  this.networkRequest.putWithHeaders(formData, `/api/addftagchapter/${this.selectedSubject['id']}/`)
  .subscribe(
    data => {
      console.log("Chapter updated ", data);
      this.toastr.success('Chapter updated successfully!', 'Updated!', {
        timeOut: 4000,
      });
      this.editTitle = null;
      this.selectedSubject = null;
      this.selectedtags = [];
      this.tag = null;
      this.getChapters();
      this.syncTag(this.selectedSubject['id']);
      this.closeModalTag.nativeElement.click();
    },
    error => {
      console.log("error ", error);
    }
  );
}

fetchDetails(id) {
  this.networkRequest.getWithHeaders(`/api/chapter/${id}/`)
  .subscribe(
    data => {
      console.log("chapter details ", data);
      this.selectedSubject = data;
      this.editTitle = this.selectedSubject['title'];
      this.editdescription = this.selectedSubject['description'];
      this.editOrder = this.selectedSubject['order'];
      this.editShow = this.selectedSubject['show'];
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
    subject: this.subjectId,
    description: this.description,
    order: this.order,
    show: this.show
  }
  this.networkRequest.postWithHeader(formData, `/api/chapter/`)
  .subscribe(
    data => {
      console.log("chapter created ", data);
      this.toastr.success('Chapter created successfully!', 'Created!', {
        timeOut: 4000,
      });
      this.title = null;
      this.description = null;
      this.closeModal.nativeElement.click();
      this.getChapters();
    },
    error => {
      console.log("error ", error);
    }
  );
}

edit() {
  const formData = {
    title: this.editTitle,
    description: this.editdescription,
    subject: this.subjectId,
    order: this.editOrder,
    show: this.editShow
  }
  this.networkRequest.putWithHeaders(formData, `/api/chapter/${this.selectedSubject['id']}/`)
  .subscribe(
    data => {
      console.log("Chapter updated ", data);
      this.toastr.success('Chapter updated successfully!', 'Updated!', {
        timeOut: 4000,
      });
      this.editTitle = null;
      this.selectedSubject = null;
      this.editdescription = null;
      this.editOrder = null;
      this.closeModalEdit.nativeElement.click();
      this.getChapters();
    },
    error => {
      console.log("error ", error);
    }
  );
}

getChapters() {
  this.networkRequest.getWithHeaders(`/api/chapter/?subject=${this.subjectId}`)
    .subscribe(
      data => {
        console.log("chapters ", data);
        this.chapters = data;
        // for (let i = 0; i < this.chapters.length; i++) {
        //   this.syncTag(this.chapters[i]['id']);
        // }
      },
      error => {
        console.log("error ", error);
      }
    );
}

getSubjectDetails() {
  this.networkRequest.getWithHeaders(`/api/subject/${this.subjectId}/`)
  .subscribe(
    data => {
      console.log("subject details ", data);
    },
    error => {
    });
}

ngOnInit(): void {
  this.route.queryParams.subscribe(
    params => {
      this.subjectId = params.id;
      if (this.subjectId) {
        this.getSubjectDetails();
        this.getChapters();
      }
  });
}

  
}
