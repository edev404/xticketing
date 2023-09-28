import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { ConfigFileService } from './services/config-file.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-config-file',
  templateUrl: './config-file.component.html',
  styleUrls: ['./config-file.component.scss'],
})
export class ConfigFileComponent implements OnInit {
  dataConfigFile
  listOfData: any[] = [];

  
  page: number = 1;
  numberRow: number = 5;
  pageConfig: number = 1;
  numberRowConfig: number = 5;
  characterMaximumLength!: number;
  idConfig!:number;
  
  filterValue: string = '';
  errorTip: string = '¡Por favor ingrese un nombre de archivo!';
  
  isVisible: boolean = false;
  isEdit: boolean = false;
  isConfigVisible: boolean = false;
  configFileEdit: boolean = false;
  editOrCreate: boolean = false;
  isConfigEdit: boolean = false;
  
  tableSizes = [5, 10, 15, 20, 30, 50, 100];
  listOfDataFilter!: Array<any>;
  Selector: any[] = [];
  campos!: any[];

  columnas: any;
  tablas: any;
  formatos: any;
  separadores: any;
  
  cont = 0;

  form: FormGroup;
  formConfig: FormGroup;

  constructor(
    private api: ConfigFileService,
    private utils: UtilsService,
    private fb: FormBuilder
  ) {
    this.form = fb.group({
      id: [null],
      name: [null, [Validators.required, Validators.maxLength(25)]],
      type: [null, [Validators.required]],
      separator: [null, [Validators.required]],
      table: [null, [Validators.required]],
      format: [null, [Validators.required]],
      active: [true],
    });

    this.formConfig = fb.group({
      id : [null],
      bdColumn: [null, [Validators.required]],
      name: [null, [Validators.required]],
      dataType: [null, [Validators.required]],
      defaults: [null],
      function: [null],
      order: [null],
      comment : [null],
      isNull : [null, [Validators.required]],
      LongMax : [null, [Validators.pattern('[0-9]{1,10}')]]
    })
  }

  async ngOnInit() {
    await this.getFormatos();
    await this.getSeparadores();
    await this.getTables();
    await this.loadConfigFiles();
  }

  onChangeRowPerPage(event: number, typeTable: string): void {
    switch (typeTable) {
      case 'main':
        this.numberRow = event;
        this.page = 1;
        break;
      case 'config':
        this.numberRowConfig = event;
        this.pageConfig = 1;
        break;
    }
  }  

  onChangePage(event: number, typeTable: string): void {
    switch (typeTable) {
      case 'main':
        this.page = event;
        break;
      case 'config':
        this.pageConfig = event;
        break;
    }
  } 

  search(): void {
    let data!: Array<any>;
    if (!this.listOfDataFilter) {
      this.listOfDataFilter = this.listOfData;
    }    
    if (this.filterValue || (this.filterValue && this.filterValue.trim() != '')) {
      data = this.listOfDataFilter.filter((current) => {
          return this.utils.validateObject(current.id)      && current.id       .toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
              this.utils.validateObject(current.name)       && current.name     .toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
              this.utils.validateObject(current.table)      && current.table    .toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
              this.utils.validateObject(current.type)       && current.type     .toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
              this.utils.validateObject(current.separator)  && current.separator.toString().toUpperCase().includes(this.filterValue.toUpperCase()) ||
              this.utils.validateObject(current.format)     && current.format   .toString().toUpperCase().includes(this.filterValue.toUpperCase())
      });
      if (data) {
        this.listOfData = data;
        toString()
      }
    } else {
      if (this.listOfDataFilter) {
        this.listOfData = this.listOfDataFilter;
        this.filterValue = ''
      }
    }
  }
  // CREAR FILE
  async loadConfigFiles() {
    const response = await this.api.getExternal(
      this.utils.getFilesEndpoint(`listConfigFile`)
    );
    response.sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      } else if (a.nombre > b.nombre) {
        return 1;
      } else {
        return 0;
      }
    });
    this.listOfData = response;
  }

  async getFormatos() {
    this.formatos = await this.api.getLista('FORMATOS');
  }

  async getSeparadores() {
    this.separadores = await this.api.getLista('SEPARADORES');    
  }

  async getTables() {
    this.tablas = await this.api.getExternal(
      this.utils.getFilesEndpoint(`listTables`),
      UtilsService.APPLICATION_JSON
    );
  }

  async saveTemplate() {
    let response;
    if (!this.form.valid) {
      Object.values(this.form.controls).map((err)=>{
        err.markAsDirty();
        err.updateValueAndValidity({ onlySelf: true });
      })
      return;
    }
    this.form.controls['id'].enable();    
    if (this.isEdit) {
      let json = this.form.value
      json.active = true;
      json.name = json.name.toUpperCase();
      response = await this.api.putExternal(this.utils.getFilesEndpoint(`updateConfigFile`), json, UtilsService.APPLICATION_JSON);
    }else{
      let json = this.form.value
      json.active = true;
      json.name = json.name.toUpperCase();
      response = await this.api.postExternal(this.utils.getFilesEndpoint(`createConfigFile`), json, UtilsService.APPLICATION_JSON);
    }

    if (response.status === this.utils.successMessage) {
      this.utils.openSuccessAlert(this.isEdit?'Se ha editado la plantilla de archivo con éxito':'Se ha creado la plantilla de archivo con éxito');
      this.isVisible = false;
      this.isEdit = false;
      this.form.reset();
      await this.loadConfigFiles();
    } else {
      if (response.respondeCode != 201) {
        this.utils.openErrorAlert(this.utils.errorGeneralMessage).then(()=>{
          this.form.controls['id'].disable();
        });
      }
      this.utils.openErrorAlert(response.data).then(()=>{
        this.form.controls['id'].disable();
      });
    }
  }

  error() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {            
          if(control.errors?.['maxlength']){
            this.errorTip = "El nombre del archivo no puede contener más de 25 caracteres.";
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }          
          if (this.form.value.name == '') this.errorTip = '¡Por favor ingrese un nombre de archivo!';
        }
      });
    }    
  }

  editConfigFile(data) { 
    this.configFileEdit = true;
    this.form.controls['id'].setValue(data.id);
    this.form.controls['id'].disable();
    this.isEdit = true;
    this.form.controls['name'].setValue(data.name);
    this.form.controls['type'].setValue(this.utils.capitalizarPrimeraLetra(data.type));
    this.form.controls['separator'].setValue(data.separator);
    this.form.controls['table'].setValue(data.table);
    this.form.controls['format'].setValue(data.format);

    this.isVisible = true;
  }

  cancelCreateFile(){
    this.isVisible = false; 
    this.isEdit = false
    this.form.reset();
    this.errorTip = '¡Por favor ingrese un nombre de archivo!';
  }
  // CONFIG FILE
  async configFile(data){
    this.isConfigVisible = true;
    this.dataConfigFile = data;
    this.formConfig.controls['dataType'].disable();
    await this.loadFieldsTable(data);
    await this.getConsultar(data);
    // await this.getTiposDatos();
  }

  async loadFieldsTable(data) {
    let nameTable = data.table.split('.')[1]; 
    const response = await this.api.getExternal(this.utils.getFilesEndpoint(`listFields/${nameTable}`));    
    this.campos = response;    
  }

  async getConsultar(data){
    this.idConfig = data.id;
    const response = await this.api.getExternal(this.utils.getFilesEndpoint(`listFieldsConfigTemplate/${data.id}`));
    this.Selector = response;
    if(response.length > 0) this.cont = response.at(-1).order; 
  }

  async getGuardar(){
    if (this.Selector.length == 0) {
      this.utils.openInfoAlert('¡Se debe configurar al menos una columna!');
      return
    }

    const ok =  this.Selector;
    this.api.createConfigPlantilla(ok).subscribe(async ({ respondeCode, status}) => {      
      if(respondeCode === 201) {
        this.utils.openSuccessAlert('¡Se ha configurado correctamente la plantilla de archivo!');
        this.isConfigVisible = false;
        this.formConfig.reset();
        await this.loadConfigFiles();
        return
      }
      this.utils.openErrorAlert('Ha habido un problema al configurar la plantilla');
    });
  }

  async getAgregar(){
    if (!this.formConfig.valid) {
      Object.values(this.formConfig.controls).map((err)=>{
        err.markAsDirty();
        err.updateValueAndValidity({ onlySelf: true });
      })
      return
    }
    
    if (parseInt(this.formConfig.value.LongMax) > this.characterMaximumLength && this.characterMaximumLength) {
      this.utils.openInfoAlert('La longitud máxima no pude ser mayor que la configurada por DB')
      return
    }
    
    if (this.Selector.find(e => e.bdColumn == this.formConfig.value.bdColumn.columnName)){
      this.utils.openInfoAlert('¡La configuración de la columna ya se encuentra agregada!')
      this.formConfig.reset();
      return
    };

    if (this.formConfig.value.name.trim() == '') {
      this.formConfig.controls['name'].setValue(null);
      return
    }
    

    this.formConfig.controls['dataType'].enable();
    
    this.Selector.push({
      id: null,
      formatId: this.dataConfigFile.id,
      name: this.formConfig.value.name,
      bdColumn: this.formConfig.value.bdColumn.columnName,
      dataType: this.formConfig.value.dataType,
      defaults: this.formConfig.value.defaults,
      function: this.formConfig.value.function,
      order: this.cont,
      comment: this.formConfig.value.comment,
      nule: this.formConfig.value.isNull,
      longMax: this.formConfig.value.LongMax,
    });
    this.Selector.map((e,i)=>{
      e.order = (i+1);
      this.cont = (i+1);
    }) 
    this.Selector = [...this.Selector];
    this.formConfig.controls['dataType'].disable();
    this.formConfig.reset();
  }

  async getEditar(data){
    this.editOrCreate = true;
    
    this.formConfig.controls['id'].setValue(data.id);
    this.formConfig.controls['bdColumn'].setValue(this.campos.find(e => e.columnName == data.bdColumn));
    this.formConfig.controls['name'].setValue(data.name);
    this.formConfig.controls['dataType'].setValue(data.dataType);
    this.formConfig.controls['defaults'].setValue(data.defaults);
    this.formConfig.controls['function'].setValue(data.function);
    this.formConfig.controls['order'].setValue(data.order);
    this.formConfig.controls['comment'].setValue(data.comment);
    this.formConfig.controls['isNull'].setValue(data.nule);
    this.formConfig.controls['LongMax'].setValue(data.longMax);
  }

  async getActualizar(){
    if (!this.formConfig.valid) {
      Object.values(this.formConfig.controls).map((err)=>{
        err.markAsDirty();
        err.updateValueAndValidity({ onlySelf: true });
      })
      return
    }

    if (this.formConfig.value.name.trim() == '') {
      this.formConfig.controls['name'].setValue(null);
      return
    }

    this.formConfig.controls['dataType'].enable();
    let data = this.Selector.find(e => e.order == this.formConfig.value.order);
    
    data.name = this.formConfig.value.name;
    data.bdColumn = this.formConfig.value.bdColumn.columnName;
    data.dataType = this.formConfig.value.dataType;
    data.defaults = this.formConfig.value.defaults;
    data.function = this.formConfig.value.function;
    data.comment = this.formConfig.value.comment;
    data.nule = this.formConfig.value.isNull;
    data.longMax = this.formConfig.value.LongMax;

    this.editOrCreate = false;
    await this.utils.openSuccessAlert('Se ha actualizado el registro correctamente');
    this.formConfig.reset();
    this.formConfig.controls['dataType'].disable();
  }

  async getEliminar(i, order){
    if (i) {
      Swal.fire(this.utils.getQuestionModalOptions('¿Deseas eliminar el registro?', `Si elimina este registro ya no se tendrá en cuenta en la configuración.`))
      .then(async (result) => {
        if (!result.isConfirmed) return;

        const resp = await this.api.deleteExternal(this.utils.getFilesEndpoint(`configFile/delete/${i}`));
        if(resp.respondeCode === 201) {
          this.utils.openSuccessAlert('¡Se ha eliminado el registro correctamente!');
          await this.getConsultar({id: this.idConfig});
          this.Selector.map((e,i)=>{
            e.order = (i+1);
            this.cont = (i+1);
          }) 
          return
        }
        this.utils.openErrorAlert('No se ha podido eliminar el campo');
        return
      })
      return
    }
    
    Swal.fire(this.utils.getQuestionModalOptions('¿Deseas eliminar el registro?', `Si elimina este registro ya no se tendrá en cuenta en la configuración.`))
      .then(async (result) => {
        if (!result.isConfirmed) return

        this.utils.openSuccessAlert('¡Se ha eliminado el registro correctamente!').then(()=>{
          var newArray = this.Selector.filter((item) => item.order !== order);
          this.Selector = newArray;
          this.Selector.map((e,i)=>{
            e.order = (i+1);
            this.cont = (i+1);
          }) 
          this.Selector = [...this.Selector];
        });
        return
      })
  }

  loadInputType(data){
    if(data){
      let form = this.formConfig;    
      form.controls['dataType'].setValue(data.udtName);
      this.characterMaximumLength = data.characterMaximumLength;    
      form.controls['LongMax'].setValue(data.characterMaximumLength);
      form.controls['defaults'].setValue(!data.columnDefault? 'null' : data.columnDefault);
    }
  }

  cancelConfig() {
    this.isConfigVisible = false;
    this.editOrCreate = false;
    this.formConfig.reset();
    this.idConfig = 0;
    this.cont = 0;  
  }

  drop(event: CdkDragDrop<string[]>): void {    
    moveItemInArray(this.Selector, event.previousIndex, event.currentIndex);
    this.Selector.map((e,i)=>{
      e.order = (i+1);
    })    
    this.Selector = [...this.Selector];
  }

  changePositionColum(data, type) {  
    switch (type) {
      case 'down':
        const temporaldown = data;
        let indexObjDown = this.Selector.indexOf(data);
        if ((indexObjDown+1) < this.Selector.length) {
          this.Selector.splice(indexObjDown, 1);
          this.Selector.splice((indexObjDown+1), 0, temporaldown);
          this.Selector.map((e,i)=>{
            e.order = (i+1);
          })  
          this.Selector = [...this.Selector];
        }
        break;
      case 'up':
        const temporalUp = data;
        let indexObjUp = this.Selector.indexOf(data);
        if ((indexObjUp-1) >= 0) {
          this.Selector.splice(indexObjUp, 1);
          this.Selector.splice((indexObjUp-1), 0, temporalUp);
          this.Selector.map((e,i)=>{
            e.order = (i+1);
          })  
          this.Selector = [...this.Selector];
        }        
        break;
    }  
    
  }

  changeStateModal(data) {
    Swal.fire(this.utils.getQuestionModalOptions('¿Deseas cambiar el estado de este dato?',
      `El estado pasara de estar ${data.active ? 'activo a inactivo.' : 'inactivo a activo.'} `)).then(async (result) => {
      if (result.isConfirmed) {
        data.active = !data.active;
        const response = await this.api.putExternal(this.utils.getFilesEndpoint(`updateConfigFile`), data, UtilsService.APPLICATION_JSON);
          if (response.status === this.utils.successMessage) {
            await this.ngOnInit();
            await this.utils.openSuccessAlert(response.message);
          } else {
            await this.utils.openErrorAlert(response.message);
          }
      } else{
        await this.loadConfigFiles();
      }
    })
  }
}
