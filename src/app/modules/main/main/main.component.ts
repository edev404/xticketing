import { Component, OnInit } from '@angular/core';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { LoginServiceService } from 'src/app/serivces/login-service/login-service.service';
import { environment } from 'src/environments/environment';
import { ParametersService } from '../../admin/admin/parameters/service/parameters.service';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  isVisible: boolean = false;
  timeCountDown!: number;
  countDown!: number;
  PATH = 'companies';
  constructor(
    private idle: Idle,
    private keepalive: Keepalive,
    private authService: LoginServiceService,
    private parameters_api: ParametersService,
    private utils: UtilsService
  ) { 
  }

  async ngOnInit(){
    await this.loadData();    
    let timeOut = this.timeCountDown*60;
    this.idle.setIdle(timeOut);
    this.idle.setTimeout(timeOut/2);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    
    this.keepalive.interval(5);

    this.idle.onTimeout.subscribe(() => {
      this.authService.closeSession();
    });

    this.idle.onTimeoutWarning.subscribe((e) => {
      this.countDown = e;
      this.isVisible = true;
    });
    this.idle.watch();
  }

  reset() {
    this.idle.watch();
    this.isVisible = false;
  }

  async loadData() {
    let entity = JSON.parse(localStorage.getItem('auth')!).user.entities[0].id;
    const response = await this.parameters_api.getGeneralConfigAdmin(`${environment.api}${this.PATH}/${entity}/config`);
    if (response.status === this.utils.successMessage) {
      let data = response.data.config;
      this.timeCountDown = data.limitTimeSession;      
    } else {
      console.log(response.message);
      
    }
  }
}
