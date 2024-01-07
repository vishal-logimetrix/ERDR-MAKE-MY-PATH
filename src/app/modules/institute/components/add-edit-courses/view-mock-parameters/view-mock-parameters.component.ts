import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-view-mock-parameters',
  templateUrl: './view-mock-parameters.component.html',
  styleUrls: ['./view-mock-parameters.component.scss']
})
export class ViewMockParametersComponent implements OnInit {

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
examId;
examDetails;
subjectDetails;
quesTypeDetails;

deleteMockParameters() {
  const formData = {
    exam: this.examId
  }
  var confirmation = confirm("Are you sure you want to delete the parameters?");
  if (confirmation) {
    this.networkRequest.putWithHeaders(formData, `/api/deletemockpaperdetails/`).subscribe(
      data => {
        console.log("mock details deleted", data);
        this.toastr.success('Parameters deleted successfully!', 'Updated!', {
          timeOut: 4000,
        });
        this.getExamParameterDetails();
      },
      error => {
        console.log("error ", error);
        this.toastr.error(error['error']['message'], 'Error!', {
          timeOut: 4000,
        });
      }
    );
  }
}

fetchDetails(id) {
  this.networkRequest.getWithHeaders(`/api/chapter/${id}/`)
  .subscribe(
    data => {
      console.log("chapter details ", data);
      this.selectedSubject = data;
      this.editTitle = this.selectedSubject['title'];
      this.editdescription = this.selectedSubject['description'];
    },
    error => {
    });
}

getExamParameterDetails() {
  this.networkRequest.getWithHeaders(`/api/getmockpaperdetails/?exam=${this.examId}`)
  .subscribe(
    data => {
      console.log("exam details ", data);
      this.examDetails = data[0];
    },
    error => {
    });
  this.networkRequest.getWithHeaders(`/api/getmockpapersubjectdetails/?exam=${this.examId}`)
  .subscribe(
    data => {
      console.log("subject details ", data);
      this.subjectDetails = data;
    },
    error => {
    });
  this.networkRequest.getWithHeaders(`/api/getmockpapersubjectquestypedetails/?exam=${this.examId}`)
  .subscribe(
    data => {
      console.log("subject ques type details ", data);
      this.quesTypeDetails = data;
    },
    error => {
    });
}

ngOnInit(): void {
  this.route.params.subscribe(
    data1 => {
      if (data1['exam']) {
        this.examId = data1['exam'];
        this.getExamParameterDetails();
      }
    }
  );
 

}

}
