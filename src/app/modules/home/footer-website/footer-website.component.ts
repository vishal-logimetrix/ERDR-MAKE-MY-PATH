import { ViewportScroller } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-website',
  templateUrl: './footer-website.component.html',
  styleUrls: ['./footer-website.component.scss']
})
export class FooterWebsiteComponent implements OnInit {

  constructor(
    private viewportScroller: ViewportScroller,
  ) { }

  activateGoTop : boolean;

  onClickScroll(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }

  @HostListener('window:scroll',[])
    onWindowScroll() {
         if ( window.scrollY > 500 ) {
            this.activateGoTop = true;
         } else {
            this.activateGoTop = false;
         }
     }

  ngOnInit(): void {

    this.activateGoTop = false;
  }

}
