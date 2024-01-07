import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent implements OnInit {

  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModalEdit') closeModalEdit: ElementRef;

  constructor(
    private networkRequest: NetworkRequestService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  categories;
  title;
  quesType;
  annText;
  editAnnText;
  isActive: boolean = true;
  editIsActive: boolean;
  editTitle;
  examList;
  questionTypes = [ 
    {val: 'mcq', name: 'Single Correct Choice'},
    {val: 'mcc', name: 'Multiple Correct Choice'},
    {val: 'fillup', name: 'Fill In The Blanks'},
    {val: 'subjective', name: 'Subjective type'},
    {val: 'numerical', name: 'Numerical'},
    {val: 'assertion', name: 'Assertion'},
    {val: 'boolean', name: 'True False'},
    {val: 'fillup_option', name: 'Fill With Option'},
  ]

  linkedTypes;
  domainId;
  selectedType;
  announcements;
  selectedExam;
  editSelectedExam;
  lastDate;
  editLastDate;
  order;
  editOrder;

  fetchDetails(id) {
    this.networkRequest.getWithHeaders(`/api/domainannouncement/${id}/`)
    .subscribe(
      data => {
        console.log("domain announcemnt ", data);
        this.selectedType = data;
        this.editAnnText = this.selectedType['text'];
        this.editIsActive = this.selectedType['is_active'];
        this.editSelectedExam = this.selectedType['linked_exam']['id'];
        this.editLastDate = this.selectedType['last_date'];
        this.editOrder = this.selectedType['order'];
      },
      error => {
      });
  }

  submit() {
    const formData = {
      linked_exam: this.selectedExam,
      text: this.annText,
      domain: this.domainId,
      is_active: this.isActive,
      last_date: this.lastDate,
      order: this.order
    }
    this.networkRequest.postWithHeader(formData, `/api/domainannouncement/`)
    .subscribe(
      data => {
        console.log("linked ", data);
        this.toastr.success('Linked successfully!', 'Linked!', {
          timeOut: 4000,
        });
        this.annText = null;
        this.closeModal.nativeElement.click();
        this.getDomainAnnouncements();
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  edit() {
    const formData = {
      is_active: this.editIsActive,
      text: this.editAnnText,
      linked_exam: this.editSelectedExam,
      last_date: this.editLastDate,
      order: this.editOrder
    }
    this.networkRequest.putWithHeaders(formData, `/api/domainannouncement/${this.selectedType['id']}/`)
    .subscribe(
      data => {
        console.log("updated", data);
        this.toastr.success('updated successfully!', 'Updated!', {
          timeOut: 4000,
        });
        this.editAnnText = null;
        this.closeModalEdit.nativeElement.click();
        this.getDomainAnnouncements();
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  getDomainExams() {
    this.networkRequest.getWithHeaders(`/api/domain/exams?domain=${this.domainId}`)
    .subscribe(
      data => {
        console.log("domain exams ", data);
        this.examList = data;
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  getDomainAnnouncements() {
    this.networkRequest.getWithHeaders(`/api/adminviewdomainannouncement/?domain=${this.domainId}`)
    .subscribe(
      data => {
        console.log("domain announcements ", data);
        this.announcements = data;
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.domainId = params.id;
        if (this.domainId) {
          this.getDomainExams();
          this.getDomainAnnouncements();
        }
    });
  }


}
