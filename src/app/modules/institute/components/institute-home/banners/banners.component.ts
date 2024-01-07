import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit {

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
    var confirmation = confirm("Are you sure you want to delete this banner?");
    if (confirmation){
      this.networkRequest.delete(`/api/editbanner/${id}/`)
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
    this.networkRequest.getWithHeaders(`/api/fetchbanners/`)
      .subscribe(
        data => {
          console.log("banners ", data);
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
