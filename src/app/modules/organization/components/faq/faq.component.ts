import {Component, OnInit} from '@angular/core';
import {NetworkRequestService} from '../../../../services/network-request.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  constructor(
    private networkRequest: NetworkRequestService
  ) {
  }

  faqObj = {};
  faqs;
  activeCard: string = "" ;

  fetchFaqId(id) {
    if (this.activeCard == id) {
      this.activeCard = null;
    }
    else{
      this.activeCard = id;
    }
    
  }

  getFAQs() {
    this.networkRequest.getWithHeaders(`/api/fetchmentorfaq/`)
      .subscribe(
        data => {
          console.log("faqs ", data);
          this.faqs = data;
          //@ts-ignore
          if (data.length > 0){
            this.fetchFaqId(data[0]['id']);
          }
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  ngOnInit() {
    this.getFAQs();
  }


}
