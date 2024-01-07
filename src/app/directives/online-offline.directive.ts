import { Directive, Renderer2, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlineOffline]'
})
export class OnlineOfflineDirective {

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {}

  @HostListener('window:online', ['$event']) onOnline(e) {
    this.renderer.removeClass(this.elRef.nativeElement, 'offline')
    this.renderer.addClass(this.elRef.nativeElement, 'online')
    this.renderer.setProperty(this.elRef.nativeElement, 'textContent', 'Online')
    setTimeout(() => {
      this.renderer.removeClass(this.elRef.nativeElement, 'online')
      this.renderer.addClass(this.elRef.nativeElement, 'network-available')
    }, 2000)
  }

  @HostListener('window:offline', ['$event']) onOffline(e) {
    this.renderer.removeClass(this.elRef.nativeElement, 'online')
    this.renderer.removeClass(this.elRef.nativeElement, 'network-available')
    this.renderer.addClass(this.elRef.nativeElement, 'offline')
    this.renderer.setProperty(this.elRef.nativeElement, 'textContent', 'Offline')
  }

}
