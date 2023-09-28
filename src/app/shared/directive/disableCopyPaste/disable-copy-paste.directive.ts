import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDisableCopyPaste]'
})
export class DisableCopyPasteDirective {

  constructor(private el: ElementRef) { }

  @HostListener('copy', ['$event'])
  onCopy(event: Event): void {
    event.preventDefault();
  }

  @HostListener('cut', ['$event'])
  onCut(event: Event): void {
    event.preventDefault();
  }

  @HostListener('paste', ['$event'])
  onPaste(event: Event): void {
    event.preventDefault();
  }

}
