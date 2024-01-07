import { Component, OnInit } from '@angular/core';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-all-selfassess-ques',
  templateUrl: './all-selfassess-ques.component.html',
  styleUrls: ['./all-selfassess-ques.component.scss']
})
export class AllSelfassessQuesComponent implements OnInit {

  constructor(
    private networkRequest: NetworkRequestService,
  ) { }

  examId;
  questions;

  getQues() {
    this.networkRequest.getWithHeaders(`/api/selfassessquestion/`)
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
