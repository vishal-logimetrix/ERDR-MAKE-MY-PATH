import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-institute-topic',
  templateUrl: './institute-topic.component.html',
  styleUrls: ['./institute-topic.component.scss']
})
export class InstituteTopicComponent implements OnInit {
  subjects: string[] = ['helo 2','helo 2','helo 6','helo 8','helo 2','helo 2','helo 6','helo 8'];
  show: boolean = true;
  design=[{"standard":"V","chapter":"Word Meaning","order":2},{"standard":"VI","chapter":"English","order":1}
    ,{"standard":"IX","chapter":"Word ","order":4}]  
  constructor(private router: Router) { }
  
  ngOnInit(): void {
  }
  
  create_topic_topic(){
  this.router.navigate(['/institute/edit-topic-topic'])
  .then(success => console.log('navigation success?', success))
  .catch(console.error);
  }
  edit_topic_topic(chapters: any){
  this.router.navigate(['/institute/edit-topic-topic',chapters.standard,chapters.chapter,chapters.order])
  .then(success => console.log('navigation success?', success))
  .catch(console.error);
  }
 
  }