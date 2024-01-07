import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-previous-papers',
  templateUrl: './previous-papers.component.html',
  styleUrls: ['./previous-papers.component.scss']
})
export class PreviousPapersComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  examId;
  books;
  examDetails;

  deleteBook(id) {
    var confirmation = confirm("Are you sure you want to delete this exam paper?");
    if (confirmation){
      this.networkRequest.delete(`/api/exampreviouspaper/${id}/`)
      .subscribe(
        data => {
          console.log("deleted ", data);
          this.getExamBooks();
        },
        error => {
          console.log("error ", error);
        }
      );
    }
  }

  getExamBooks() {
    this.networkRequest.getWithHeaders(`/api/courses/${this.examId}/`)
    .subscribe(
      data => {
        console.log("exam details ", data);
        this.examDetails = data;
      },
      error => {
      });
    this.networkRequest.getWithHeaders(`/api/viewexampreviouspaper/?exam=${this.examId}`)
      .subscribe(
        data => {
          console.log("exam books ", data);
          this.books = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.examId = params.id;
        if (this.examId) {
          this.getExamBooks();
        }
    });
  }
}
