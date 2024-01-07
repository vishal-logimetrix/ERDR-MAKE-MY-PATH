import { Component, OnInit } from '@angular/core';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-all-postquery-questions',
  templateUrl: './all-postquery-questions.component.html',
  styleUrls: ['./all-postquery-questions.component.scss']
})
export class AllPostqueryQuestionsComponent implements OnInit {

  constructor(
    private networkRequest: NetworkRequestService,
  ) { }

  examId;
  questions;

  getQues() {
    this.networkRequest.getWithHeaders(`/api/postqueryquestions/`)
      .subscribe(
        data => {
          console.log("questions ", data);
          this.questions = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  ngOnInit(): void {
    this.getQues();
  }


}
