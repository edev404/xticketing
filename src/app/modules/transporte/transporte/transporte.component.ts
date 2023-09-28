import { Component, OnInit } from '@angular/core';
import { Company } from '../models/company';
import { NavigationEnd, Router } from '@angular/router';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { filter, Subscription } from 'rxjs';
import { ComunicarService } from '../service/comunicar.service';
import { TransporteService } from '../service/transporte.service';

@Component({
  selector: 'app-transporte',
  templateUrl: './transporte.component.html',
  styleUrls: ['./transporte.component.scss'],
})
export class TransporteComponent implements OnInit {
  entitySubscription: Subscription | undefined;
  estadoSelect: boolean = false;
  vistaInforme: boolean = false;
  width;
  isActiveName;
  iniciando: number = 0;
  selectedCompany;
  isActive = '';
  titelBreadcrumb: string = 'Rutas';
  menu = true;
  showData: boolean = false;
  showCollect: boolean = false;
  termsItems: any;
  paymentsItems: any;
  idEntity: any;
  navModules: any = [];
  companies!: Company[];
  companyCopy: Company | undefined | null = null;
  // PATH APIS

  constructor(
    private router: Router,
    private api: TransporteService,
    private utils: UtilsService,
    public _comunicarService: ComunicarService
  ) {
    this.selectedCompany = '';
  }

  async ngOnInit() {
    this.idEntity = JSON.parse(localStorage.getItem('selectedEntity')!);
    this.entitySubscription = await this.utils.permisosEntitysBehavior.subscribe(
      async (Behavior) => {
        this.loadTitelBreadCrumb();
        await this.loadCompanies();
        const company = JSON.parse(localStorage.getItem('selectedCompany')!);
        if (company) {
          await this.setSelectedCompany(company.id);
        }
      }
    );
    this.showData = false;
  }

  async loadTitelBreadCrumb() {
    const url = String(this.router.url).split("/")[3];
    switch (url) {
      case 'transporte':
        this.titelBreadcrumb = 'Rutas';
        break;
      case 'transfer':
        this.titelBreadcrumb = 'Transbordos';
        break;
      case 'reports':
        this.titelBreadcrumb = 'Reportes';
        break;
      case 'informe':
        this.vistaInforme = true;
        this.titelBreadcrumb = 'Informe';
        break;
      case 'view-collection':
        this.titelBreadcrumb = 'Recaudos';
        this.showCollect = true;
        break;
    }
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event) => {
      let url = event['url'].split('/');
      switch (url.at(-1)) {
        case 'transporte':
          this.showCollect = false;
          this.titelBreadcrumb = 'Rutas';
          break;
        case 'transfer':
          this.showCollect = false;
          this.titelBreadcrumb = 'Transbordos';
          break;
        case 'reports':
          this.showCollect = false;
          this.titelBreadcrumb = 'Reportes';
          break;
        case 'informe':
          this.vistaInforme = true;
          this.showCollect = false;
          this.titelBreadcrumb = 'Informe';
          break;
        case 'view-collection':
          this.showCollect = true;
          this.titelBreadcrumb = 'Recaudos';
          break;
      }
    });
  }

  async loadCompanies() {
    const companies = JSON.parse(localStorage.getItem('selectedEntity')!);
    if (companies) {
      this.companies = companies.companies.filter(
        (company: Company) => company.active && company.typeId == 1
      );
    }
  }

  async setSelectedCompany(companyId) {
    const routes = this.router.url.split('/');

    if (companyId) {
      this.showData = true;
    }

    if (companyId == null) {
      this.showData = false;
      return;
    }

    const company = this.companies.find((company) => company.id == companyId);
    this.companyCopy = company;
    if (company) {
      this.isActive = routes[3];
      if (this.iniciando > 0) {
        this.selectedCompany = companyId;
      }
      localStorage.setItem('selectedCompany', JSON.stringify(company));

      if (routes.length > 3) {
        this.redirectTo(`/main/transporte/${this.isActive}`);
      } else {
        this.redirectTo(`/main/transporte`);
      }
    }
    this.iniciando++;
  }

  async loadCollect(companyId) {
    await this.api.getCollect(this.utils.getCollectionEndPoint(`collects`), {
      idEntity: this.idEntity.entities[0].id,
      idCompany: companyId
    });
  }
  
  async rechargeCollect(){    
    await this.api.getCollect(this.utils.getCollectionEndPoint(`collects`), {
      idEntity: this.idEntity.entities[0].id,
      idCompany: this.selectedCompany
    });
    this.redirectTo(`/main/transporte/${this.isActive}`);
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/main/transporte/ficticio', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }
}
