import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-approved-schools',
  templateUrl: './approved-schools.component.html',
  styleUrls: ['./approved-schools.component.scss']
})
export class ApprovedSchoolsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  examId;
  institutes;

  getSchools() {
    this.networkRequest.getWithHeaders(`/api/verifiedinstitutes/`)
      .subscribe(
        data => {
          console.log("schools ", data);
          this.institutes = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  ngOnInit(): void {
    this.getSchools();
  }


}
