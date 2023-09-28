import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router  } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { LoginServiceService } from 'src/app/serivces/login-service/login-service.service';
import { ReportesService } from '../../service/reportes.service';

@Component({
  selector: 'app-ver-estadisticas',
  templateUrl: './ver-estadisticas.component.html',
  styleUrls: ['./ver-estadisticas.component.scss']
})
export class VerEstadisticasComponent implements OnInit {

  titelBreadCrumb!: string;
  reports!: any[];

  constructor(
    private routerActive: ActivatedRoute,
    private router: Router,
    private api: ReportesService,
    private authService: LoginServiceService,
    private utils: UtilsService
  ) { }

  ngOnInit(): void {
    this.loadReports();
    this.changeRoute();
  }

  async loadReports() {
    let id = parseInt(this.routerActive.snapshot.paramMap.get('id')!);
    const auth = this.authService.getAuth();
    if (auth) {
      const resp = await this.api.getActionsByModule(auth.user.id, 4);
      if (resp.status === this.utils.successMessage) {
        let modulReport = resp.data.categories[0].actions[1].subActions.find(e => e.id == id);
        this.titelBreadCrumb = modulReport.name;
        this.reports = modulReport.subActions;
        // console.log(this.reports);
        
      } else {                         
        await this.utils.openErrorAlert(resp.message);
      }
    }
  }

  changeRoute(){
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(async(event) => {
      await this.loadReports();
    });
  }

}
