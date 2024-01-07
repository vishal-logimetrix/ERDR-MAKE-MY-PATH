import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-question-tags',
  templateUrl: './question-tags.component.html',
  styleUrls: ['./question-tags.component.scss']
})
export class QuestionTagsComponent implements OnInit {

  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModalEdit') closeModalEdit: ElementRef;

  constructor(
    private networkRequest: NetworkRequestService,
    private toastr: ToastrService
  ) { }

  tags;
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
  uploadedTags;

  downloadFile(){
    let link = document.createElement("a");
    link.download = "bulk_edit.xlsx";
    link.href = "assets/bulk_edit.xlsx";
    link.click();
  }

  submitFile() {
    this.uploadedTags = null;
    let gct = [];
    const excel = (<HTMLInputElement>document.getElementById('excel')).files[0];

    if (!excel) {
      this.toastr.error('Please upload excel file!', 'Error!', {
        timeOut: 4000,
      });
      return;
    }

    let formData: FormData = new FormData();
    formData.append("excel_file", excel);
    this.networkRequest.postFormData(formData, '/api/bulkftagupload/').subscribe(
      data => {
        console.log("Tags successfully updated", data);
        this.toastr.success('FTag created successfully!', 'Created!', {
          timeOut: 4000,
        });
        this.uploadedTags = data['ftags'];
        this.goToPage(this.currentPage);
      },
      error => {
        console.log("error ", error);
        this.toastr.error(error['message']['message'], 'Error!', {
          timeOut: 4000,
        });
      }
    )
  }


  fetchDetails(id) {
    this.networkRequest.getWithHeaders(`/api/filtertag/${id}/`)
    .subscribe(
      data => {
        console.log("tag details ", data);
        this.selectedTag = data;
        this.editTitle = this.selectedTag['title'];
        this.editdescription = this.selectedTag['description']
      },
      error => {
      });
  }

  submit() {
    const formData = {
      title: this.title,
      description: this.description
    }
    this.networkRequest.postWithHeader(formData, `/api/filtertag/`)
    .subscribe(
      data => {
        console.log("FTag created ", data);
        this.toastr.success('FTag created successfully!', 'Created!', {
          timeOut: 4000,
        });
        this.title = null;
        this.description = null;
        this.closeModal.nativeElement.click();
        this.getTags();
      },
      error => {
        console.log("error ", error);
        this.toastr.error(error['error']['errors'][0], 'Error!', {
          timeOut: 4000,
        });
      }
    );
  }

  edit() {
    const formData = {
      title: this.editTitle,
      description: this.editdescription
    }
    this.networkRequest.putWithHeaders(formData, `/api/filtertag/${this.selectedTag['id']}/`)
    .subscribe(
      data => {
        console.log("FTag updated ", data);
        this.toastr.success('FTag updated successfully!', 'Updated!', {
          timeOut: 4000,
        });
        this.editTitle = null;
        this.editdescription = null;
        this.selectedTag = null;
        this.closeModalEdit.nativeElement.click();
        this.getTags();
      },
      error => {
        console.log("error ", error);
      }
    );
  }


  getTags() {
    this.networkRequest.getWithHeaders(`/api/filtertag/?page=${this.currentPage}`)
      .subscribe(
        data => {
          console.log("tags ", data);
          this.tags = data['results'];
          let page_size = data['page_size'];
          this.links = data['links'];
          if (data['count'] % page_size === 0) {
            this.max_page = Math.floor(data['count'] / page_size);
          } else {
            this.max_page = Math.floor(data['count'] / page_size) + 1;
          }
          this.pages = ' '.repeat(this.max_page).split('');
          if (this.max_page < 11) {
            // less than 10 total pages so show all
            this.startPage = 1;
            this.endPage = this.max_page;
          } else if (this.currentPage < 6) {
            this.startPage = 1;
            this.endPage = 10;
          } else if (this.currentPage >= 6 && this.currentPage < this.max_page - 5) {
            this.startPage = this.currentPage - 4;
            this.endPage = this.currentPage - (-5);
          } else {
            this.startPage = this.max_page - 9;
            this.endPage = this.max_page;
          }
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  goToPage(pageIndex) {
    this.currentPage = pageIndex;
    this.getTags();
  }

  ngOnInit(): void {
    this.goToPage(1);
  }

}
