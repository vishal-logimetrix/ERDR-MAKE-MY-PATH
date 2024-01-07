import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-topic-topic',
  templateUrl: './edit-topic-topic.component.html',
  styleUrls: ['./edit-topic-topic.component.scss']
})
export class EditTopicTopicComponent implements OnInit {
  title : string;
  description : string;
  order : number;
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.title = this.route.snapshot.params['title'];
    this.description = this.route.snapshot.params['description'];
    this.order = parseInt(this.route.snapshot.params['order']);
  }

}
