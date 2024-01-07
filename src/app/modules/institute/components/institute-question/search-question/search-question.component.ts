import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-search-question',
  templateUrl: './search-question.component.html',
  styleUrls: ['./search-question.component.scss']
})
export class SearchQuestionComponent implements OnInit {

  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModalEdit') closeModalEdit: ElementRef;

  constructor(
    private networkRequest: NetworkRequestService,
    private toastr: ToastrService
  ) { }

  queries;
  title;
  editTitle;
  selectedTag;
  description;
  editdescription;
  links;
  max_page: number;
  pages = [];
  currentPage: number;
  startPage: number = 1;
  endPage: number = 1;
  identifier;

  searchQuestions() {
    this.networkRequest.getWithHeaders(`/api/searchquestionbyidentifier/?text=${this.identifier}`).subscribe(
      data => {
        console.log("searched questions ", data);
        this.queries = data;
      },
      error => {
        console.log("error ", error);
      }
    )
  }

  ngOnInit(): void {
  }

}
