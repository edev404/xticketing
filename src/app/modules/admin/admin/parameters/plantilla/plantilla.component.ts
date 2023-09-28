import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/myUtils/utils.service';
// import { Editor } from 'ngx-editor';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import { ParametersService } from '../service/parameters.service';
import { Notificacion, Plantilla, PlantillaEmail } from '../models/models';

@Component({
  selector: 'app-plantilla',
  templateUrl: './plantilla.component.html',
  styleUrls: ['./plantilla.component.scss']
})
export class PlantillaComponent implements OnInit, OnDestroy {
  text: string = ''
  formulario: FormGroup;
  html = 'Hello world!';
  public Editor = ClassicEditor;

  filterValueTable: string = '';

  plantillas: PlantillaEmail[] = [];
  plantillasCopy: PlantillaEmail[] = [];

  mostrarData: boolean = false;
  ocultar: boolean = false;

  editar: boolean = false;
  editarJson!: PlantillaEmail | undefined;

  tableSizes = [5, 10, 15, 20, 30, 50, 100];
  page: number = 1;
  numberRow: number = 5;

  constructor(
    private formBuilder: FormBuilder,
    private util: UtilsService,
    private _parametersService: ParametersService
  ) {
    this.formulario = this.formBuilder.group({
      text: ['', [Validators.required]]
    })
    // this.editor = new Editor();
  }
  ngOnInit(): void {
    this.cargarPlantilla();
  }

  cargarPlantilla() {
    this._parametersService.getListPlantilla(this.util.getBasicEndPoint('plantilla'))
      .subscribe(
        {
          next: (value: any) => {
            this.plantillas = value.data.plantillas.sort((a: any, b: any) => b.estado - a.estado);
            this.plantillasCopy = this.plantillas;
            this.mostrarData = this.plantillas.length > 0 ? true : false;
          }
        }
      );
  }


  ngOnDestroy(): void {
    // this.editor.destroy();
  }

  async enviarPlantilla() {
    if (this.formulario.valid) {
      const json: Plantilla = {
        name: 'Notificaciones',
        format: this.formulario.value.text,
        extensions: '.html'
      }

      const not: Notificacion = {
        nombre: 'Notificaciones',
        asunto: 'Notificación de fraude',
        mensaje: this.formulario.value.text,
        estado: this.editarJson?.estado!
      }
      if (this.editar) {
        not['id'] = this.editarJson!.id;
        this._parametersService.updatePlantillaNot(this.editarJson!.id!, not)
          .subscribe(
            {
              next: (value: any) => {
                this.util.openSuccessAlert("Plantilla actualizada exitosamente")
                this.cargarPlantilla();
                this.formulario.reset()
                this.ocultar = false;
              },
              error: (err: any) => {

              }
            })
        return;
      }
      this._parametersService.subirPlantilla(json)
        .subscribe(
          {
            next: (value: any) => {
              this._parametersService.subirPlantillaNot(not)
                .subscribe(
                  {
                    next: (value: any) => {
                      this.util.openSuccessAlert("Plantilla creada exitosamente")
                      this.formulario.reset()
                      this.ocultar = false;
                      this.cargarPlantilla();
                    },
                    error: (err: any) => {

                    }
                  }
                )

            },
            error: (err: any) => {
              console.log(err)
            }
          }
        )

    } else {
      this.util.openInfoAlert("Plantilla vacio, por favor digite una informacion")
    }
  }

  estadoCambiado(event: any, estado: boolean, data: PlantillaEmail) {
    console.log(estado)
    this.editarJson = event;
    const not: Notificacion = {
      nombre: 'Notificaciones',
      asunto: 'Notificación de fraude',
      mensaje: data.mensaje,
      estado: !estado
    }
    not['id'] = data!.id;
    this._parametersService.updatePlantillaNot(data!.id!, not)
      .subscribe(
        {
          next: (value: any) => {
            this.util.openSuccessAlert("Estado actaulizado exitosamente")
            this.cargarPlantilla();
            this.formulario.reset()
          },
          error: (err: any) => {

          }
        })
  }

  nuevo(){
    this.formulario.get('text')?.setValue('');
  }

  editarPlantilla(event: PlantillaEmail) {
    this.editar = true;
    this.editarJson = event;
    this.formulario.get('text')?.setValue(event.mensaje);
  }

  search() {
    let data: any[];
    if (this.filterValueTable || (this.filterValueTable && this.filterValueTable.trim() != '')) {
      data = this.plantillasCopy.filter(
        (current: any) => {
          return this.util.validateObject(current.nombre) && current.nombre!.toString().toUpperCase().includes(this.filterValueTable!.toUpperCase())
        }
      );
      if (data) {
        this.plantillas = data;
      }
    } else {
      if (this.plantillasCopy) {
        this.plantillas = this.plantillasCopy;
        this.filterValueTable = ''
      }
    }
  }

  onChangeRowPerPage(event: number): void {
    this.numberRow = event;
    this.page = 1;
  }

  onChangePage(event: number): void {
    this.page = event;
  }
}
