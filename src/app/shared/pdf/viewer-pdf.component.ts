import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-viewer-pdf',
  templateUrl: './viewer-pdf.component.html',
  styleUrls: ['./viewer-pdf.component.scss']
})
export class ViewerPdfComponent implements OnInit {
  @Input() urlFile;


  constructor() { }

  ngOnInit(): void {
  }

}
