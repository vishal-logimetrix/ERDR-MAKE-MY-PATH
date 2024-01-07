import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-design-course',
  templateUrl: './design-course.component.html',
  styleUrls: ['./design-course.component.scss']
})
export class DesignCourseComponent implements OnInit {

  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModalEdit') closeModalEdit: ElementRef;

constructor(
  private router: Router,
  private route: ActivatedRoute,
  private networkRequest: NetworkRequestService,
  private fb: FormBuilder,
  private toastr: ToastrService
) { }

title;
editTitle;
order;
editOrder;
examId;
subjects;
selectedSubject;
examDetails;
show: boolean = true;
editShow: boolean = true;

fetchDetails(id) {
  this.networkRequest.getWithHeaders(`/api/subject/${id}/`)
  .subscribe(
    data => {
      console.log("subject details ", data);
      this.selectedSubject = data;
      this.editTitle = this.selectedSubject['title'];
      this.editOrder = this.selectedSubject['order'];
      this.editShow = this.selectedSubject['show'];
    },
    error => {
    });
}

submit() {
  const formData = {
    title: this.title,
    examid: this.examId,
    order: this.order,
    show: this.show
  }
  this.networkRequest.postWithHeader(formData, `/api/subject/`)
  .subscribe(
    data => {
      console.log("subject created ", data);
      this.toastr.success('Subject created successfully!', 'Created!', {
        timeOut: 4000,
      });
      this.title = null;
      this.order = null;
      this.closeModal.nativeElement.click();
      this.getSubjects();
    },
    error => {
      console.log("error ", error);
    }
  );
}

edit() {
  const formData = {
    title: this.editTitle,
    order: this.editOrder,
    show: this.editShow
  }
  this.networkRequest.putWithHeaders(formData, `/api/subject/${this.selectedSubject['id']}/`)
  .subscribe(
    data => {
      console.log("subject updated ", data);
      this.toastr.success('Subject updated successfully!', 'Updated!', {
        timeOut: 4000,
      });
      this.editTitle = null;
      this.editOrder = null;
      this.selectedSubject = null;
      this.closeModalEdit.nativeElement.click();
      this.getSubjects();
    },
    error => {
      console.log("error ", error);
    }
  );
}

getSubjects() {
  this.networkRequest.getWithHeaders(`/api/allsubject/?exam=${this.examId}`)
    .subscribe(
      data => {
        console.log("subjects ", data);
        this.subjects = data;
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
    });
}

ngOnInit(): void {
  this.route.queryParams.subscribe(
    params => {
      this.examId = params.id;
      if (this.examId) {
        this.getExamDetails();
        this.getSubjects();
      }
  });
}

create_package(){
this.router.navigate(['/institute/create-path-question'])
.then(success => console.log('navigation success?', success))
.catch(console.error);
}
  
prac_assess(){
this.router.navigate(['/institute/practice-assess'])
.then(success => console.log('navigation success?', success))
.catch(console.error);
}
}