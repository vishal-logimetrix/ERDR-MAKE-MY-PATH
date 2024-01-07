import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-design-domain',
  templateUrl: './design-domain.component.html',
  styleUrls: ['./design-domain.component.scss']
})
export class DesignDomainComponent implements OnInit {

  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModalExam') closeModalExam: ElementRef;
  @ViewChild('closeModalEdit') closeModalEdit: ElementRef;

  design=[{"standard":"V","chapter":"Word Meaning","order":2},{"standard":"VI","chapter":"English","order":1}
  ,{"standard":"IX","chapter":"Word ","order":4}]  

  domainId;
  domainDetails;
  journeys;
  exams;
  journeyForm: FormGroup;
  currentNode;
  nodeTitle;
  nodeQuestion;
  order;
  editnodeTitle;
  editnodeQuestion;
  editOrder;
  selectedExam;
  selectedLevelId;
  levels;
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  tag: any;
  errors;
  myControl = new FormControl();
  successFlag = false;
  TagData;

constructor(
  private networkRequest: NetworkRequestService,
  private router: Router,
  private route: ActivatedRoute,
  private toastr: ToastrService,
  private fb: FormBuilder,
) { }

search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(text => text.length < 2 ? []
        : this.options.filter(v => v.toLowerCase().indexOf(text.toLowerCase()) > -1).slice(0, 10))
)

removeTag(id) {
    this.selectedExam = null;
}

detectTag(obj: any) {
  let array1 = [];

  let text = obj.target.value

  this.networkRequest.getWithHeaders(`/api/searchexam/?text=${text}&level=${this.selectedLevelId || null}`).subscribe(
    data => {
      console.log("tags ", data);
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
    }
  )
  if (this.options.length == 0 || obj.target.value.length < 2){
    document.getElementById("typeahead-basic").classList.remove("input-field-radius");
  }
  else {
    document.getElementById("typeahead-basic").classList.add("input-field-radius");
  }
  
  this.filteredOptions = this.myControl.valueChanges.pipe(
    startWith(''),
    map(value => this._filter(value))
  );
}

TagFilter() {
  let filtered = [];
  this.selectedExam = null;
  for (let i = 0; i < this.TagData.length; i++) {
    if (this.TagData[i].title == this.tag) {
      console.log("tagaaaa", this.TagData[i], this.tag)
      filtered.push(this.TagData[i]);
      this.successFlag = true;
    }
  }
  this.selectedExam = filtered[0]['id'];
  if (this.selectedExam) {
    this.toastr.success('Exam Selected, you can now link exam!', 'Selected!', {
      timeOut: 4000,
    });
  }
  
}

private _filter(value: string): string[] {
  const filterValue = value.toLowerCase();

  return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
}


getExams(id) {
  this.exams = null;
  this.selectedLevelId = id;
  this.networkRequest.getWithHeaders(`/api/courses/?level=${this.selectedLevelId}`)
  .subscribe(
    data => {
      console.log("exams ", data);
      this.exams = data;
    },
    error => {
    });
}

getDomainNodeDetails(id) {
  this.networkRequest.getWithHeaders(`/api/domainnode/${id}/`)
  .subscribe(
    data => {
      console.log("node details ", data);
      this.currentNode = data;
    },
    error => {
    });
}

deleteCurrentNode() {
  const formData = {
    domain: this.domainId
  }
  var confirmation = confirm("Are you sure you want to delete this junction?");
  if (confirmation){
    this.networkRequest.putWithHeaders(formData, `/api/domainnode/delete/${this.currentNode['id']}/`)
    .subscribe(
      data => {
        console.log("exam linked ", data);
        this.currentNode = null;
        this.toastr.success('Junction successfully deleted!', 'Deleted!', {
          timeOut: 4000,
        });
        this.getInitialNode();
      },
      error => {
        console.log("error ", error);
      }
    );
  }
}

populateEditForm() {
  this.editnodeTitle = this.currentNode['text'];
  this.editnodeQuestion = this.currentNode['question_text'];
  this.editOrder = this.currentNode['order'];
}

edit() {
  const formData = {
    text: this.editnodeTitle,
    question_text: this.editnodeQuestion,
    order: this.editOrder
  }

  this.networkRequest.putWithHeaders(formData, `/api/domainnode/${this.currentNode['id']}/`)
  .subscribe(
    data => {
      this.closeModalEdit.nativeElement.click();
      this.editnodeTitle = null;
      this.editnodeQuestion = null;
      this.editOrder = null;
      this.toastr.success('Node updated successfully!', 'Updated!', {
        timeOut: 4000,
      });
      this.getDomainNodeDetails(this.currentNode['id']);
    },
    error => {
    });
}

removeLinkedExamEdit() {
  var confirmation = confirm("Are you sure you want to delink this exam?");
  if (confirmation){
    const formData = {
      text: this.currentNode['text'],
      question_text: this.currentNode['question_text'],
      linked_exam: null
    }

    this.networkRequest.putWithHeaders(formData, `/api/domainnodedelinkexam/${this.currentNode['id']}/`)
    .subscribe(
      data => {
        this.editnodeTitle = null;
        this.editnodeQuestion = null;
        this.editOrder = null;
        this.toastr.success('Exam removed successfully!', 'Updated!', {
          timeOut: 4000,
        });
        this.getDomainNodeDetails(this.currentNode['id']);
      },
      error => {
      });
  }
}

submit() {
  var formData;

  if (this.journeys.length == 0) {
    this.nodeTitle = this.domainDetails['title'];
    this.nodeQuestion = null;
    formData = {
      text: this.nodeTitle,
      question_text: this.nodeQuestion,
      domain: this.domainId,
      order: this.order
    }
  }
  else {
    formData = {
      current_node: this.currentNode['id'],
      text: this.nodeTitle,
      question_text: this.nodeQuestion,
      domain: this.domainId,
      order: this.order
    }
  }
  
  console.log("formData ", formData);

  this.networkRequest.postWithHeader(formData, `/api/domainnode/`).subscribe(
    data => {
      console.log("node successfully created ", data);
      this.closeModal.nativeElement.click();
      this.nodeTitle = null;
      this.nodeQuestion = null;
      this.order = null;
      this.toastr.success('Node created successfully!', 'Created!', {
        timeOut: 4000,
      });
      if (this.journeys.length == 0) {
        this.getInitialNode();
        this.getDomainNodeDetails(this.currentNode['id']);
      }
      else {
        const successiveData = {
          newNode: data['id']
        }
        this.networkRequest.putWithHeaders(successiveData, `/api/domainnode/addsuccessive/${this.currentNode['id']}/`)
        .subscribe(
          data => {
            console.log("successiveData ", data);
            this.getDomainNodeDetails(this.currentNode['id']);
          },
          error => {
            console.log("error ", error);
          }
        );
      }
    },
    error => {
      console.log("error ", error);
    }
  );
}

submitExamForm() {
  const formData = {
    exam: this.selectedExam,
    domain: this.domainId
  }
  this.networkRequest.putWithHeaders(formData, `/api/domainnode/addexam/${this.currentNode['id']}/`)
  .subscribe(
    data => {
      console.log("exam linked ", data);
      this.selectedExam = null;
      this.closeModalExam.nativeElement.click();
      this.getDomainNodeDetails(this.currentNode['id']);
    },
    error => {
      console.log("error ", error);
    }
  );
}

getDomainDetails() {
  this.networkRequest.getWithHeaders(`/api/domain/${this.domainId}/`)
  .subscribe(
    data => {
      console.log("domain details ", data);
      this.domainDetails = data;
      this.getInitialNode();
    },
    error => {
    });
}

// getDomainJourneys() {
//   this.networkRequest.getWithHeaders(`/api/domainnode/?domain_id=${this.domainId}`)
//   .subscribe(
//     data => {
//       console.log("journeys ", data);
//       this.journeys = data;
//       this.currentNode = this.journeys[0];
//       if (this.journeys.length == 0) {
//         this.submit();
//       }
//     },
//     error => {
//     });
// }

getInitialNode() {
  this.networkRequest.getWithHeaders(`/api/initialdomainnode/?domain_id=${this.domainId}`)
  .subscribe(
    data => {
      console.log("initial node ", data);
      this.journeys = data;
      this.currentNode = data[0];
      if (this.journeys.length == 0) {
        this.submit();
      }
    },
    error => {
    });
}

getExamLevels() {
  this.networkRequest.getWithHeaders('/api/examlevel/')
    .subscribe(
      data => {
        console.log("levels ", data);
        this.levels = data;
      },
      error => {
        console.log("error ", error);
      }
    );
}

ngOnInit(): void {
  this.getExamLevels();
  this.route.queryParams.subscribe(
    params => {
      this.domainId = params.id;
      if (this.domainId) {
        this.getDomainDetails();
      }
  });
}

prac_assess(){
this.router.navigate(['/institute/journey-path'])
.then(success => console.log('navigation success?', success))
.catch(console.error);
}

}
