import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-add-edit-courses',
  templateUrl: './add-edit-courses.component.html',
  styleUrls: ['./add-edit-courses.component.scss']
})
export class AddEditCoursesComponent implements OnInit {
  design=[{"standard":"V","chapter":"Word Meaning","order":2},{"standard":"VI","chapter":"English","order":1}
  ,{"standard":"IX","chapter":"Word ","order":4}]  
 
constructor(
  private router: Router,
  private networkRequest: NetworkRequestService
) { }

courses;
selectedLevelId;
levels;

editCourse(id) {
  this.router.navigate(["/institute/edit-course"],{
    queryParams: {
      id: id
    }
  });
}

fetchExams(levelId) {
  this.selectedLevelId = levelId;
  this.getCourses();
}

getLevels() {
  this.networkRequest.getWithHeaders('/api/examlevel/')
    .subscribe(
      data => {
        console.log("levels ", data);
        this.levels = data;
        this.selectedLevelId = this.levels[0]['id'];
        this.getCourses();
      },
      error => {
        console.log("error ", error);
      }
    );
}

getCourses() {
  this.networkRequest.getWithHeaders(`/api/courses/?level=${this.selectedLevelId}`)
    .subscribe(
      data => {
        console.log("courses ", data);
        // Populate Selected Assessment list with server data
        this.courses = data;
      },
      error => {
        console.log("error ", error);
      }
    );
}

ngOnInit(): void {
  this.getLevels();
}

create_course(){
this.router.navigate(['/institute/create-course'])
.then(success => console.log('navigation success?', success))
.catch(console.error);
}
edit_course(courses: any){
this.router.navigate(['/institute/create-course',courses.standard,courses.chapter,courses.order])
.then(success => console.log('navigation success?', success))
.catch(console.error);
}

}


