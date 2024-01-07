import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-domain-category',
  templateUrl: './domain-category.component.html',
  styleUrls: ['./domain-category.component.scss']
})
export class DomainCategoryComponent implements OnInit {

  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModalEdit') closeModalEdit: ElementRef;

  constructor(
    private networkRequest: NetworkRequestService,
    private toastr: ToastrService
  ) { }

  categories;
  title;
  editTitle;
  selectedCategory;

  fetchDetails(id) {
    this.networkRequest.getWithHeaders(`/api/examcategory/${id}/`)
    .subscribe(
      data => {
        console.log("category details ", data);
        this.selectedCategory = data;
        this.editTitle = this.selectedCategory['title'];
      },
      error => {
      });
  }

  submit() {
    const formData = {
      title: this.title
    }
    this.networkRequest.postWithHeader(formData, `/api/examcategory/`)
    .subscribe(
      data => {
        console.log("category created ", data);
        this.toastr.success('Categoty created successfully!', 'Created!', {
          timeOut: 4000,
        });
        this.title = null;
        this.closeModal.nativeElement.click();
        this.getCategories();
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  edit() {
    const formData = {
      title: this.editTitle
    }
    this.networkRequest.putWithHeaders(formData, `/api/examcategory/${this.selectedCategory['id']}/`)
    .subscribe(
      data => {
        console.log("category updated", data);
        this.toastr.success('Categoty updated successfully!', 'Updated!', {
          timeOut: 4000,
        });
        this.editTitle = null;
        this.selectedCategory = null;
        this.closeModalEdit.nativeElement.click();
        this.getCategories();
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  getCategories() {
    this.networkRequest.getWithHeaders('/api/examcategory/')
      .subscribe(
        data => {
          console.log("categories ", data);
          // Populate Selected Assessment list with server data
          this.categories = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  ngOnInit(): void {
    this.getCategories();
  }

}
