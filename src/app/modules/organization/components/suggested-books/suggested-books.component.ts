import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { BatchServiceService } from '../../services/batch-service.service';

@Component({
  selector: 'app-suggested-books',
  templateUrl: './suggested-books.component.html',
  styleUrls: ['./suggested-books.component.scss']
})
export class SuggestedBooksComponent implements OnInit {

  constructor(
    private networkRequest: NetworkRequestService,
    private batchservice: BatchServiceService,
    private route: ActivatedRoute
  ) { }

  examId;
  examDetails;
  books;
  bookDetails;
  batchId;
  totalusers;
  batchDetails;
  activeCard: string = "" ;
  showShortDesciption = true;
  spinner:boolean = true;

 alterDescriptionText() {
    this.showShortDesciption = !this.showShortDesciption
 }

  fetchBookDetail(id) {
    this.activeCard = id ;
    for (let i = 0; i < this.books.length; i++) {
      if (this.books[i]['id'] == id) {
        this.bookDetails = this.books[i];
      }
    }
  }

  fetchBooks() {
    this.networkRequest.getWithHeaders(`/api/viewexambooks/?exam=${this.examId}`)
      .subscribe(
        data => {
          console.log("exam books ", data);
          this.books = data;
          this.spinner = false;
          if (this.books.length > 0) {
            this.bookDetails = this.books[0];
            this.activeCard = this.books[0]['id'];
          }
        },
        error => {
          console.log("error ", error);
          this.spinner = false;
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

  getBatchDetails() {
    this.networkRequest.getWithHeaders(`/api/batch/${this.batchId}/`)
      .subscribe(
        data => {
          console.log("batch details ", data);
          this.batchDetails = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }
  ngOnInit(): void {
    this.route.params.subscribe(
      data1 => {
        if (data1['exam']) {
          this.batchservice.updateExamId(data1['exam']);
          this.examId = data1['exam'];
          this.getExamDetails();
          this.fetchBooks();
        }
      }
    );
    this.route.params.subscribe(
      data1 => {
        if (data1['batch']) {
          this.batchservice.updateBatchId(data1['batch']);
          this.batchId = data1['batch'];
          this.getBatchDetails();
        }
      }
    );
  }

}
