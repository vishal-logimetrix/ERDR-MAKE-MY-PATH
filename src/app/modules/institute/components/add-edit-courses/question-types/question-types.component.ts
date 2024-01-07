import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-question-types',
  templateUrl: './question-types.component.html',
  styleUrls: ['./question-types.component.scss']
})
export class QuestionTypesComponent implements OnInit {

  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModalEdit') closeModalEdit: ElementRef;

  constructor(
    private networkRequest: NetworkRequestService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  categories;
  title;
  quesType;
  marks;
  negMarks;
  editMarks;
  editNegMarks;
  isActive: boolean = true;
  editIsActive: boolean;
  editTitle;
  questionTypes = [ 
    {val: 'mcq', name: 'Single Correct Choice'},
    {val: 'mcc', name: 'Multiple Correct Choice'},
    {val: 'fillup', name: 'Fill In The Blanks'},
    {val: 'subjective', name: 'Subjective type'},
    {val: 'numerical', name: 'Numerical'},
    {val: 'assertion', name: 'Assertion'},
    {val: 'boolean', name: 'True False'},
    {val: 'fillup_option', name: 'Fill With Option'},
  ]

  linkedTypes;
  examId;
  selectedType;
  examDetails;

  fetchDetails(id) {
    this.networkRequest.getWithHeaders(`/api/examlinkedquestiontypes/${id}/`)
    .subscribe(
      data => {
        console.log("linked type details ", data);
        this.selectedType = data;
        this.editIsActive = this.selectedType['is_active'];
        this.editMarks = this.selectedType['marks'];
        this.editNegMarks = this.selectedType['negative_marks'];
      },
      error => {
      });
  }

  submit() {
    const formData = {
      exam: this.examId,
      is_active: this.isActive,
      marks: this.marks,
      negative_marks: this.negMarks,
      type_of_question: this.quesType
    }
    this.networkRequest.postWithHeader(formData, `/api/examlinkedquestiontypes/`)
    .subscribe(
      data => {
        console.log("linked ", data);
        this.toastr.success('Linked successfully!', 'Linked!', {
          timeOut: 4000,
        });
        this.isActive = true;
        this.marks = 0;
        this.negMarks = 0;
        this.quesType = null;
        this.closeModal.nativeElement.click();
        this.getLinkedTypes();
      },
      error => {
        console.log("error ", error);
        this.toastr.error(error['error']['errors'][0], 'Error!', {
          timeOut: 4000,
        });
      }
    );
  }

  edit() {
    const formData = {
      is_active: this.editIsActive,
      marks: this.editMarks,
      negative_marks: this.editNegMarks
    }
    this.networkRequest.putWithHeaders(formData, `/api/examlinkedquestiontypes/${this.selectedType['id']}/`)
    .subscribe(
      data => {
        console.log("updated", data);
        this.toastr.success('updated successfully!', 'Updated!', {
          timeOut: 4000,
        });
        this.editMarks = null;
        this.editIsActive = false;
        this.selectedType = null;
        this.closeModalEdit.nativeElement.click();
        this.getLinkedTypes();
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  getLinkedTypes() {
    this.networkRequest.getWithHeaders(`/api/courses/${this.examId}/`)
    .subscribe(
      data => {
        console.log("exam details ", data);
        this.examDetails = data;
      },
      error => {
      });
    this.networkRequest.getWithHeaders(`/api/showallexamlinkedquestiontypes/?exam=${this.examId}`)
    .subscribe(
      data => {
        console.log("linked types ", data);
        this.linkedTypes = data;
      },
      error => {
      });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.examId = params.id;
        if (this.examId) {
          this.getLinkedTypes();
        }
    });
  }

}
