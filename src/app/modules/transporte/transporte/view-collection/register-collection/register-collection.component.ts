import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Collect, CollectInfo, Novelty } from '../../../models/company';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { ViewCollectionService } from '../view-collection.service';
import { LoginServiceService } from 'src/app/serivces/login-service/login-service.service';

@Component({
  selector: 'app-register-collection',
  templateUrl: './register-collection.component.html',
  styleUrls: ['./register-collection.component.scss']
})
export class RegisterCollectionComponent implements OnInit {
  @Output() CloseRegister = new EventEmitter<any>();
  @Input() collectionId!: any;
  @Input() isCollectBalance: boolean = false;

  currentCollection!: Collect;
  
  isDownload: boolean = false;
  valueMising: boolean = false;
  isSummary: boolean = false;
  isAnswerNot: boolean = false;
  totalCollection: boolean = false;
  showButton: boolean = true;
  showButtonMissing: boolean = true
  print: boolean = false;
  valueReceivedIncompletedModal: boolean = false;
  hiddenInputs: boolean = false;
  showRegister: boolean = false;
  
  inputsValues: any[] = [];
  novelties!: Novelty[];
  
  configurarCantidad: number = 0;
  contadorValueMissing: number = 0;
  totalReceived: number = 0;
  valueExcedent: number = 0;
  lastValue: number = 0;
  manualCollect: number = 0;
  valueMissing: number = 0;
  
  ipClient: string = '';
  
  filter: any;
  collectionStates: any;
  collectionReason;
  motiveCollectSelected: any;
  stateCollectSelected: any;
  currentCollectionInfo!: any;
  
  COLLECTION_STATE_PATH = 'masters/collect-states';
  COLLECTION_MOTIVES_PATH = 'masters/collect-motives';
  PATH = 'collects';
  NOVELTIES_PATH = 'novelties';

  constructor(
    private utils: UtilsService,
    private api: ViewCollectionService,
    private auth: LoginServiceService
  ) { }

  async ngOnInit() {
    this.currentCollection = {...this.currentCollection};
    this.currentCollection.travel = {...this.currentCollection.travel};

    await this.findById();
    await this.loadCollectionStates();
    await this.loadCollectionMotives();
  }

  closeRegister(){
    this.CloseRegister.emit({state: false, id: null});
  }

  changeRegister() {
    this.CloseRegister.emit({state: false, id: this.collectionId});
  }

  filterCb() {
    if (this.currentCollection.stateId && this.collectionStates) {
      const filterData = this.filterCollectionState();
      if (filterData) {
        this.stateCollectSelected = filterData;

        if (this.stateCollectSelected && !this.stateCollectSelected.motiveRequired) {
          this.currentCollection.motiveId = null;
        }
        if (this.stateCollectSelected && !this.stateCollectSelected.valueRequired) {          
          this.currentCollection.manualCollect = this.totalReceived;
        }
        if (this.stateCollectSelected && !this.stateCollectSelected.observationRequired) {
          this.currentCollection.observation = null;
        }

        this.currentCollection.valueMissing = 0;
      }
    }
  }

  deleteLabelAndButton(){
    this.showButtonMissing = false;
  }

  filterCollectionState(returnObject: boolean = true) {
    if (this.collectionStates) {
      const filterDate = this.collectionStates.filter(
        (row) => row.id == this.currentCollection.stateId
      );
      if (filterDate && filterDate.length > 0) {
        if (returnObject) {
          return filterDate[0];
        } else {
          return filterDate[0].name;
        }
      } else {
        return undefined;
      }
    }
    return undefined;
  }

  filterCollectionMotive(returnObject: boolean = true) {
    if (this.collectionReason) {
      const filterDate = this.collectionReason.filter(
        (row) => row.id == this.currentCollection.motiveId
      );
      if (filterDate && filterDate.length > 0) {
        if (returnObject) {
          return filterDate[0];
        } else {
          return filterDate[0].name;
        }
      } else {
        return undefined;
      }
    }
    return undefined;
  }

  setCurrentInfo() {
    if (this.currentCollection && !this.currentCollectionInfo) {
      this.currentCollectionInfo = {
        balance: this.currentCollection.balance,
        manualCollect: this.currentCollection.manualCollect,
        observation: this.currentCollection.observation,
        collect: this.currentCollection.collect,
        state: ''
      };
  
      // Filtramos el estado 
      const dataStateFilter = this.filterCollectionState();
      if (dataStateFilter) {
        this.currentCollectionInfo.state = dataStateFilter.name;
        this.currentCollectionInfo.valueRequired = dataStateFilter.valueRequired;
      }
  
      // Filtramos el motivo 
      const dataMotiveFilter = this.filterCollectionMotive();
      if (dataMotiveFilter) {
        this.currentCollectionInfo.motive = dataMotiveFilter.name;
      }
    }
  }

  getTotalReceived() {
    this.totalReceived = parseInt(localStorage.getItem('valueCollection')!);
  }

  answerYes() {
    this.valueMising = true;
    this.showButton = false;
    this.valueReceivedIncompletedModal = false    
    if (this.isCollectBalance) {
      this.valueMissing = this.currentCollection.valueMissing   
      this.registerMissing(this.valueMissing);
      this.deleteLabelAndButton();
    }
    this.inputsValues.push({value: 0});
  }

  registerValue() {
    localStorage.setItem('valueCollection', JSON.stringify(this.manualCollect));
    this.getTotalReceived();

    // recaudo total
    if (this.totalReceived >= this.currentCollection.collect || this.totalReceived >= this.currentCollection.balance) {
      this.totalCollectionFunction();
      this.showButton = false;
    }
    // recaudo parcial
    if (this.totalReceived < this.currentCollection.collect && !this.isCollectBalance) {
      this.currentCollection.valueMissing = this.currentCollection.collect - this.totalReceived;
      this.valueReceivedIncompletedModal = true;
    } 
    // recaudo parcial balance
    if (this.totalReceived < this.currentCollection.balance && this.isCollectBalance){
      this.currentCollection.valueMissing = this.currentCollection.balance - this.totalReceived;
      this.valueReceivedIncompletedModal = true;
    }
  }

  async registerMissing(valuesMissing: any) {
    localStorage.setItem('valueCollection', JSON.stringify(parseInt(localStorage.getItem('valueCollection')!) + valuesMissing));
    await this.getTotalReceived();
    
    if (this.totalReceived >= this.currentCollection.collect || this.totalReceived >= this.currentCollection.balance) {
      this.totalCollectionFunction();
      this.deleteLabelAndButton();
    }

    if (this.totalReceived < this.currentCollection.collect && !this.isCollectBalance) {
      this.currentCollection.valueMissing = this.currentCollection.collect - this.totalReceived;
      this.answerNot()
    }
    
    if (this.totalReceived < this.currentCollection.balance && this.isCollectBalance){
      this.currentCollection.valueMissing = this.currentCollection.balance - this.totalReceived;
      this.answerNot()
    }
  }

  async answerNot() {
    this.getTotalReceived();
    if (this.totalReceived === 0) {
      this.currentCollection.stateId = 3;
    } else {
      this.currentCollection.stateId = 2;
    }
    this.isAnswerNot = true;
    this.showButton = false;
    this.showRegister = true;
    await this.filterCb();
    this.valueReceivedIncompletedModal = false
  }

  async downloadPdf() {
    if (this.print) {
      const DATA = document.getElementById('contentPrint');
      const doc = new jsPDF('p', 'pt', 'letter');
      const options = {
        background: 'white',
        scale: 3,
      };
      html2canvas(DATA!, options)
        .then((canvas) => {
          const img = canvas.toDataURL('image/PNG');
          // Add image Canvas to PDF
          const bufferX = 15;
          const bufferY = 15;
          const imgProps = (doc as any).getImageProperties(img);
          const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          doc.addImage(
            img,
            'PNG',
            bufferX,
            bufferY,
            pdfWidth,
            pdfHeight,
            undefined,
            'FAST'
          );
          return doc;
        })
        .then((docResult) => {
          docResult.save(`recaudo.pdf`);
          this.isDownload = false;
          // printjs({ printable: 'contentPrint', type:'html',scanStyles: true  });
        });
    }
  }

  async totalCollectionFunction() {
    this.currentCollection.stateId = 1;
    await this.filterCb();
    this.getTotalReceived();
    this.valueExcedent = this.totalReceived - this.currentCollection.collect;
    this.totalCollection = true;
    this.showRegister = true;
  }

  async summaryViewerShow() {
    if(this.currentCollection){
      if (!this.currentCollection.motiveId && this.isAnswerNot) {
        this.utils.openInfoAlert('Ingrese un motivo para continuar');
        return;
      } 
    }
    if (this.manualCollect <= 0) {
      this.utils.openInfoAlert('Ingrese un valor a registrar válido');
      return;
    }

    if (this.stateCollectSelected && this.stateCollectSelected.valueRequired) {
      if (this.manualCollect < 0) {
        this.isDownload = false;
        await this.utils.openErrorAlert('El valor parcial debe ser mayor a igual 0.');
        return;
      }
    }
    this.hiddenInputs = true;
    this.isSummary = !this.isSummary;
  }

  async saveTraceabilityCollect(obj: Collect) {
    const auth = this.auth.getAuth();
    const jsonTraceability = {
      idColletion: obj.id,
      idTravel: obj.travel.id,
      valueCollet: obj.manualCollect,
      cashier: auth.user.firstName,
      date: new Date(),
      typeCollect: 'T-R'
    };
    await this.api.createTraceabilityCollect(this.utils.getBasicEndPoint(`pendingbalance/createTraceabilityCollect`), JSON.stringify(jsonTraceability));
  }

  async save() {
    this.isDownload = this.print;
    if (this.isCollectBalance) {          
      if (this.stateCollectSelected.valueRequired) {  
        this.currentCollection.manualCollect = this.currentCollection.collect - this.manualCollect;
      } else {
        this.currentCollection.manualCollect = this.currentCollectionInfo.collect;
      }
    } else {
      if (!this.isAnswerNot) this.currentCollection.collect = this.totalReceived;
      this.currentCollection.manualCollect = this.totalReceived;
      this.currentCollection.valueMissing = this.valueExcedent;
    }
    const auth = this.auth.getAuth();
    this.currentCollection.userCreatorId = auth.user.id;
    console.log(this.currentCollection);
    
    const response = await this.api.update(this.utils.getCollectionEndPoint(`${this.PATH}/${this.currentCollection.id}`),this.currentCollection);
    if (response && response.status === this.utils.successMessage) {
      await this.saveTraceabilityCollect(this.currentCollection);
      await this.utils.openSuccessAlert('Recaudo registrado.');
      await this.downloadPdf();
      await this.utils.sleep(500);
      this.CloseRegister.emit(false);
      localStorage.removeItem('valueCollection');
    } else if (response.showAlert) {
      this.isDownload = false;
      await this.utils.openErrorAlert(response.message);
    }
  }

  async findById() {
    const response = await this.api.findById(this.utils.getCollectionEndPoint(`${this.PATH}/${this.collectionId}`));
    if (response.status === this.utils.successMessage) {
      this.currentCollection = response.data.collect;
      this.currentCollection.totalRecaudado = this.currentCollection.collect;
      if (this.currentCollection.totalBarras > this.currentCollection.collect){
        this.currentCollection.collect = this.currentCollection.totalBarras;
        this.currentCollection.balance = this.currentCollection.totalBarras;
      }
      
      await this.setCurrentInfo();
      if (this.isCollectBalance) {
        this.currentCollection.manualCollect = this.currentCollection.balance;
        // this.currentCollection.collect = this.currentCollection.balance;
        this.manualCollect = this.currentCollection.balance;
      } else {
        this.manualCollect = this.currentCollection.collect;
      }
      this.currentCollection.stateId = 1;
      await this.filterCb();
    } else if (response.showAlert) {      
      await this.utils.openErrorAlert(response.message);
    }
  }

  async loadCollectionStates() {
    const response = await this.api.getdCollectStates(this.utils.getCollectionEndPoint(this.COLLECTION_STATE_PATH));
    if (response.status === this.utils.successMessage) {
      this.collectionStates = response.data.collectStates;
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }

  async loadCollectionMotives() {
    const response = await this.api.getCollectMotives(this.utils.getCollectionEndPoint(this.COLLECTION_MOTIVES_PATH));
    if (response.status === this.utils.successMessage) {
      this.collectionReason = response.data.collectMotives;
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
  }
}
