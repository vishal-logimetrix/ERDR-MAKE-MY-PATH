import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  examId;
  faqs;

  deleteFAQ(id) {
    var confirmation = confirm("Are you sure you want to delete this faq?");
    if (confirmation){
      this.networkRequest.delete(`/api/editfaq/${id}/`)
      .subscribe(
        data => {
          console.log("deleted ", data);
          this.getFAQs();
        },
        error => {
          console.log("error ", error);
        }
      );
    }
  }

  getFAQs() {
    this.networkRequest.getWithHeaders(`/api/fetchfaq/`)
      .subscribe(
        data => {
          console.log("faqs ", data);
          this.faqs = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  ngOnInit(): void {
    this.getFAQs();
  }

}
