import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {

  constructor() { }

  hideMentorSidenav(){
    document.getElementById("mySidenav").style.width = "0";
  }

  ngOnInit() {
  }

}
