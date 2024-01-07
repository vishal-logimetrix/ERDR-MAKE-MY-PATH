import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { InstituteService } from '../../../services/institute.service';

const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';
@Component({
  selector: 'app-upload-students',
  templateUrl: './upload-students.component.html',
  styleUrls: ['./upload-students.component.scss']
})
export class UploadStudentsComponent implements OnInit {
  subjects: string[] = ['helo 2','helo 2','helo 6','helo 8','helo 2','helo 2','helo 6','helo 8'];
  uploader:FileUploader;
  hasBaseDropZoneOver:boolean;
  hasAnotherDropZoneOver:boolean;
  response:string;

  successMsg;
  errors;

  constructor(
    private instituteService: InstituteService
  ) { 
    this.uploader = new FileUploader({
      url: URL,
      disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
      formatDataFunctionIsAsync: true,
      formatDataFunction: async (item) => {
        return new Promise( (resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date()
          });
        });
      }
    });
 
    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;
 
    this.response = '';
 
    this.uploader.response.subscribe( res => this.response = res );
  }

  
  downloadFile(){
    let link = document.createElement("a");
    link.download = "bulk_register.csv";
    link.href = "assets/bulk_register.csv";
    link.click();
  }

  submitCSV() {
    this.successMsg = null;
    this.errors = null;
    const csvFile = (<HTMLInputElement>document.getElementById('csvFile')).files[0];
    if (csvFile) {
      let fileData: FormData = new FormData();
      fileData.append("csv_file", csvFile);
        this.instituteService.bulkUploadStudents(fileData).subscribe(
          data => {
            console.log("Students created successfully ", data);
            this.successMsg = "Students created successfully. ";
          },
          error => {
            console.log("error ", error);
            this.errors = error['error'];
          }
        )
    }
  }

  ngOnInit(): void {
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
 
  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }
}

