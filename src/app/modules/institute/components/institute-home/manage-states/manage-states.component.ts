import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { Subscription } from 'rxjs';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-states',
  templateUrl: './manage-states.component.html',
  styleUrls: ['./manage-states.component.scss']
})
export class ManageStatesComponent implements OnInit {

  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModalEdit') closeModalEdit: ElementRef;

  constructor(
    private networkRequest: NetworkRequestService,
    private toastr: ToastrService,
    private ngxCsvParser: NgxCsvParser,
    private formBuilder: FormBuilder
  ) { }

  addCityForm: FormGroup;
  title;
  editTitle;
  selectedTag;
  description;
  editdescription;
  states;
  cities;
  p: number = 1;
  csvRecords: any[] = [];
  header = false;
  selectedStateId;
  selectedStateIdentifier;
  showStatesFlag: boolean = true;
  stateToCreate;

  showStateCities(stateId) {
    this.cities = null;
    this.showStatesFlag = false;
    this.networkRequest.getWithHeaders(`/api/citiesList/?state=${stateId}`)
      .subscribe(
        data => {
          console.log("cities ", data);
          this.cities = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  showStates() {
    this.showStatesFlag = true;
    this.fetchStates();
  }

  get name(){
    return this.addCityForm.get('name');
  }

  fetchStateIdentifier(id) {
    for (let i = 0; i < this.states.length; i++) {
      if (this.states[i]['id'] == id) {
        this.selectedStateIdentifier = this.states[i]['identifier'];
      }
    }
  }

  onFileChange(event) {
    this.csvRecords = [];
    const files = event.srcElement.files;
 
     // Parse the file you want to select for the operation along with the configuration
     this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ',' })
       .pipe().subscribe((result: Array<any>) => {
  
         console.log('Result', result);
         this.csvRecords = result;
       }, (error: NgxCSVParserError) => {
         //'Error', error);
       });
  }

  createSingleState() {
    const formData = {
      name: this.stateToCreate,
      identifier: (this.states.length + 1)
    }
    console.log("formData", formData);
    this.networkRequest.postWithHeader(formData, `/api/statesList/`).subscribe(
      data => {
        console.log("state created ", data);
        this.stateToCreate = null;
        this.fetchStates();
        this.toastr.success('State successfully created!', 'Created!', {
          timeOut: 5000,
        });
       
      },
      error => {
        console.log("error", error);
        this.toastr.error(error['error']['detail'], 'Error!', {
          timeOut: 5000,
        });
      }
    )
  }


  createState() {
    var formData;
    for (let i = 0; i < this.csvRecords.length; i++) {
      formData = {
        identifier: this.csvRecords[i][0],
        name: this.csvRecords[i][1]
      }
      console.log("formData", formData);
      this.networkRequest.postWithHeader(formData, `/api/statesList/`).subscribe(
        data => {
          console.log("state created ", data);
          if (i == this.csvRecords.length - 1) {
            this.fetchStates();
          }
          this.toastr.success((this.csvRecords[i][1]+' successfully created!'), 'Created!', {
            timeOut: 5000,
          });
        
        },
        error => {
          console.log("error", error);
          this.toastr.error(error['error']['detail'], 'Error!', {
            timeOut: 5000,
          });
        }
      )
    }
  }

  createAllCitiesByCsv() {
    var formData;
    for (let i = 0; i < this.states.length; i++) {
      for (let j = 0; j < this.csvRecords.length; j++) {
        setTimeout(() => {
          if (this.states[i]['identifier'] == Number(this.csvRecords[j][2])) {
            formData = {
              state: this.states[i]['id'],
              identifier: this.csvRecords[j][0],
              name: this.csvRecords[j][1]
            }
            console.log("formData", formData);
            this.networkRequest.postWithHeader(formData, `/api/citiesList/`).subscribe(
              data => {
                console.log("city created ", data);
                if (i == this.states.length - 1 && j == this.csvRecords.length -1) {
                  this.fetchStates();
                }
                this.toastr.success((this.csvRecords[j][1]+' successfully created!'), 'Created!', {
                  timeOut: 2000,
                });
              
              },
              error => {
                console.log("error", error);
                this.toastr.error(error['error']['detail'], 'Error!', {
                  timeOut: 5000,
                });
              }
            )
          }
        }, 1000);
        
        if (i == this.states.length - 1) {
          this.fetchStates();
          setTimeout(() => {
            // this.csvRecords = [];
          }, 1000);
        }
      }
    }
  }


  createCitiesByCsv() {
    var formData;
    for (let i = 0; i < this.csvRecords.length; i++) {
      if (this.selectedStateIdentifier == Number(this.csvRecords[i][2])) {
        formData = {
          state: this.selectedStateId,
          identifier: this.csvRecords[i][0],
          name: this.csvRecords[i][1]
        }
        console.log("formData", formData);
        this.networkRequest.postWithHeader(formData, `/api/citiesList/`).subscribe(
          data => {
            console.log("city created ", data);
            if (i == this.csvRecords.length - 1) {
              this.selectedStateIdentifier = null;
              this.fetchStates();
            }
            this.toastr.success((this.csvRecords[i][1]+' successfully created!'), 'Created!', {
              timeOut: 2000,
            });
          
          },
          error => {
            console.log("error", error);
            this.toastr.error(error['error']['detail'], 'Error!', {
              timeOut: 5000,
            });
          }
        )
      }
      if (i == this.csvRecords.length - 1) {
        this.fetchStates();
        // this.selectedStateIdentifier = null;
      }
    }
  }

  submit() {
    const formData = {
      name: this.addCityForm.value.name,
      state: this.selectedStateId,
      identifier: (this.cities.length + 1)
    }
    console.log("formData", formData);
    this.networkRequest.postWithHeader(formData, `/api/citiesList/`).subscribe(
      data => {
        console.log("city created ", data);
        this.addCityForm.reset();
        this.fetchStates();
        this.toastr.success('City successfully created!', 'Created!', {
          timeOut: 5000,
        });
       
      },
      error => {
        console.log("error", error);
        this.toastr.error(error['error']['detail'], 'Error!', {
          timeOut: 5000,
        });
      }
    )
  }


  fetchStates() {
    this.networkRequest.getWithHeaders(`/api/statesList/`)
      .subscribe(
        data => {
          console.log("states ", data);
          this.states = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  createCityForm() {
    this.addCityForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    this.createCityForm();
    this.fetchStates();
  }


}
