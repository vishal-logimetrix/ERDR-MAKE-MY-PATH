import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-exam-level',
  templateUrl: './exam-level.component.html',
  styleUrls: ['./exam-level.component.scss']
})
export class ExamLevelComponent implements OnInit {

  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModalEdit') closeModalEdit: ElementRef;

  constructor(
    private networkRequest: NetworkRequestService,
    private toastr: ToastrService
  ) { }

  levels;
  title;
  editTitle;
  selectedCategory;

  fetchDetails(id) {
    this.networkRequest.getWithHeaders(`/api/examlevel/${id}/`)
    .subscribe(
      data => {
        console.log("level details ", data);
        this.selectedCategory = data;
        this.editTitle = this.selectedCategory['label'];
      },
      error => {
      });
  }

  submit() {
    const formData = {
      label: this.title
    }
    this.networkRequest.postWithHeader(formData, `/api/examlevel/`)
    .subscribe(
      data => {
        console.log("level created ", data);
        this.toastr.success('Level created successfully!', 'Created!', {
          timeOut: 4000,
        });
        this.title = null;
        this.closeModal.nativeElement.click();
        this.getLevels();
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  edit() {
    const formData = {
      label: this.editTitle
    }
    this.networkRequest.putWithHeaders(formData, `/api/examlevel/${this.selectedCategory['id']}/`)
    .subscribe(
      data => {
        console.log("level updated ", data);
        this.toastr.success('Level updated successfully!', 'Updated!', {
          timeOut: 4000,
        });
        this.editTitle = null;
        this.selectedCategory = null;
        this.closeModalEdit.nativeElement.click();
        this.getLevels();
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  getLevels() {
    this.networkRequest.getWithHeaders('/api/examlevel/')
      .subscribe(
        data => {
          console.log("levels ", data);
          this.levels = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  ngOnInit(): void {
    this.getLevels();
  }

}
