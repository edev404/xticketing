import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.component.html',
  styleUrls: ['./view-list.component.scss']
})
export class ViewListComponent implements OnInit {

  titelBreadCrumb: string = 'Listas blancas';

  constructor() { }

  ngOnInit(): void {
  }

  tabSelect(event){    
    switch (event) {
      case 0:
        this.titelBreadCrumb = 'Listas blancas';
        break;
      case 1:
        this.titelBreadCrumb = 'Listas grises';
        break;
      case 2:
        this.titelBreadCrumb = 'Listas negras';
        break;
    }    
  }

}
