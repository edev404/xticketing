import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Collect, Novelty, Zone } from '../../../models/company';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { ViewCollectionService } from '../view-collection.service';

@Component({
  selector: 'app-travel-analysis',
  templateUrl: './travel-analysis.component.html',
  styleUrls: ['./travel-analysis.component.scss']
})
export class TravelAnalysisComponent implements OnInit {

  @Output() CloseTravel = new EventEmitter<any>();
  @Input() collectionId!: string;
  @Input() type!: string;
  @Input() isReport: boolean = false;

  // permission
  create;

  listOfData01!: Novelty[];
  zones!: Zone[];
  currentCollection!: Collect;
  date!: string;
  hour!: string;
  zoneCount: {
    ups?: number;
    downs?: number;
    blocks?: number;
    qrUps?: number;
    cardUps?: number;
    transferUps?: number;
    realityNumber?: number;
  } = {};

  // PATH
  PATH = 'collects';
  NOVELTIES_PATH = 'novelties';
  ZONES_PATH = 'zones';

  constructor( 
    private utils: UtilsService,
    private api: ViewCollectionService
  ) { }

  async ngOnInit() {
    if (this.collectionId) {
      await this.loadNovelties();
      await this.loadZones();
      await this.findById();
    }
    this.checkPermissions();
  }

  setZoneCount() {
    if (this.zones && this.zones.length > 0) {
      this.zoneCount.ups = this.zones
        .map((zone) => zone.ups)
        .reduce((prev, curr) => prev + curr);
      this.zoneCount['downs'] = this.zones
        .map((zone) => zone.downs)
        .reduce((prev, curr) => prev + curr);
      this.zoneCount['blocks'] = this.zones
        .map((zone) => zone.blocks)
        .reduce((prev, curr) => prev + curr);
      this.zoneCount['qrUps'] = this.zones
        .map((zone) => zone.qrUps)
        .reduce((prev, curr) => prev + curr);
      this.zoneCount['cardUps'] = this.zones
        .map((zone) => zone.cardUps)
        .reduce((prev, curr) => prev + curr);
      this.zoneCount['transferUps'] = this.zones
        .map((zone) => zone.transferUps)
        .reduce((prev, curr) => prev + curr);
      this.zoneCount['realityNumber'] = this.zones
        .map((zone) => zone.realityNumber)
        .reduce((prev, curr) => prev + curr);
    }
  }

  checkPermissions() {
    this.create = this.utils.existTypeAction(UtilsService.CREATE);
  }

  closeTravel() {
    this.CloseTravel.emit({state: false, id: null});
  }
  
  changeRegister() {
    this.CloseTravel.emit({state: false, id: this.collectionId});
  }

  async loadNovelties() {
    const resp = await this.api.getNovelties(this.utils.getCollectionEndPoint(`${this.PATH}/${this.collectionId}/${this.NOVELTIES_PATH}`));
    if (resp.status === this.utils.successMessage) {
      this.listOfData01 = resp.data.novelties;
    } else if (resp.showAlert) {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async loadZones() {
    const resp = await this.api.getNovelties(this.utils.getCollectionEndPoint(`${this.PATH}/${this.collectionId}/${this.ZONES_PATH}`));
    if (resp.status === this.utils.successMessage) {
      this.zones = resp.data.zones;
      this.setZoneCount();
    } else if (resp.showAlert) {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async findById() {
    const resp = await this.api.findById(this.utils.getCollectionEndPoint(`${this.PATH}/${this.collectionId}`));
    if (resp && resp.status === this.utils.successMessage) {
      this.currentCollection = resp.data.collect;
      if (this.currentCollection.date) {
        const split = this.currentCollection.date.split(' ');
        if (split) {
          this.date = split[0];
          this.hour = split[1];
        }
      }
    } else if (resp.showAlert) {
      await this.utils.openErrorAlert(resp.message);
    }
  }

}
