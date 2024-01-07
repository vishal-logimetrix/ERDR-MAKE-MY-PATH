import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Router } from '@angular/router';

const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';
@Component({
  selector: 'app-edit-students-list',
  templateUrl: './edit-students-list.component.html',
  styleUrls: ['./edit-students-list.component.scss']
})
export class EditStudentsListComponent implements OnInit {
  list: string[] = ['helo 2','helo 2','helo 6','helo 8'];
  uploader:FileUploader;
  hasBaseDropZoneOver:boolean;
  hasAnotherDropZoneOver:boolean;
  response:string;

  constructor(private router: Router) { 
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

  ngOnInit(): void {
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
 
  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }
  stu_package=[{"number":"V","package":"Word Meaning"},
  {"number":"VI","package":"English"},
  {"number":"IX","package":"Word "},
  {"number":"V","package":"Word Meaning"},
  {"number":"VI","package":"English"},
  {"number":"IX","package":"Word "},
  {"number":"V","package":"Word Meaning"},
  {"number":"VI","package":"English"},
  {"number":"IX","package":"Word "},
  {"number":"V","package":"Word Meaning"},
  {"number":"VI","package":"English"},
  {"number":"IX","package":"Word "}]  

  back(){
    this.router.navigate(['/institute/student-list'])
    .then(success => console.log('navigation success?', success))
    .catch(console.error);
  }
}


