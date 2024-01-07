import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-add-edit-domains',
  templateUrl: './add-edit-domains.component.html',
  styleUrls: ['./add-edit-domains.component.scss']
})
export class AddEditDomainsComponent implements OnInit {
  design=[{"standard":"V","chapter":"Word Meaning","order":2},{"standard":"VI","chapter":"English","order":1}
  ,{"standard":"IX","chapter":"Word ","order":4}]  
 
constructor(
  private router: Router,
  private networkRequest: NetworkRequestService
) { }

domains;

editDomain(id) {
  this.router.navigate(["/institute/edit-domain"],{
    queryParams: {
      id: id
    }
  });
}

getCourses() {
  this.networkRequest.getWithHeaders('/api/alldomains/')
    .subscribe(
      data => {
        console.log("domains ", data);
        // Populate Selected Assessment list with server data
        this.domains = data;
      },
      error => {
        console.log("error ", error);
      }
    );
}

ngOnInit(): void {
  this.getCourses();
}

create_domain(){
this.router.navigate(['/institute/add-domain'])
.then(success => console.log('navigation success?', success))
.catch(console.error);
}
edit_course(courses: any){
this.router.navigate(['/institute/create-course',courses.standard,courses.chapter,courses.order])
.then(success => console.log('navigation success?', success))
.catch(console.error);
}
design_course(){
this.router.navigate(['/institute/design-domain'])
.then(success => console.log('navigation success?', success))
.catch(console.error);
}

}
