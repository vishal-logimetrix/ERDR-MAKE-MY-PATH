import { Directive, OnInit, ElementRef, Renderer2, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appNavbar]'
})
export class NavbarDirective implements OnInit {

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2
  ) { }

  @HostListener('window:scroll', ['$event']) onWindowScroll(e) {
    if (e.target['scrollingElement'].scrollTop > 170) {
      this.renderer.addClass(this.elRef.nativeElement, 'nav-scroll')
    } else {
      this.renderer.removeClass(this.elRef.nativeElement, 'nav-scroll')
    }
  }

  ngOnInit() {
  }

}
