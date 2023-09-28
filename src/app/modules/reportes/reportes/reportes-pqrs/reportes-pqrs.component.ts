import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DescuentosService } from 'src/app/modules/descuentos/service/descuentos.service';
import { ServiceRateService } from 'src/app/modules/tarifas/service/service-rate.service';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { IReporte } from 'src/app/shared/models/reportes.interface';

@Component({
  selector: 'app-reportes-pqrs',
  templateUrl: './reportes-pqrs.component.html',
  styleUrls: ['./reportes-pqrs.component.scss', '../../../../../assets/themes/white/core/_formulario.scss']
})
export class ReportesPqrsComponent implements OnInit {

  reportes: IReporte[];
  filname: string = '';

  // FORMULARIO
  enviarFormulario: boolean = false;
  fechaRango!: Date | undefined;
  descargar: boolean = false;

  // CONFIGURACION USERNAME
  id: number = 0;
  username: string = '';

  // PARA CARGAR PDF
  urlFile;
  urlFileCopy;

  constructor(
    private utils: UtilsService,
    private api: DescuentosService,
    private sanitizer: DomSanitizer
  ) {
    this.reportes = [
      {
        id: 1,
        name: 'PQR',
        path: '',
        estado: true
      }
    ];
  }

  ngOnInit(): void {
  }

  getSelectedEntity(): void {
    const entity = JSON.parse(String(localStorage.getItem('selectedEntity')));
    console.log(entity)
    if (entity) {
      this.username = entity.username;
      this.id = entity.userId;
    }
  }


  recibirEmiter(event: number) {
    // REINICIAMOS VARIABLES
    this.urlFile = '';
    this.descargar = false;

    for (let index = 0; index < this.reportes.length; index++) {
      if (event != index) {
        this.reportes[index].estado = false;
      } else {
        this.reportes[event].estado = true
      }
    }
    this.getSelectedEntity();
  }

  evaluarFormulario(): {} {
    const report = this.reportes.find((element: IReporte) => element.estado == true)
    switch (report?.id) {
      case 1: {
        this.filname = 'XT_RCL01_PasajerosFormaPagoRuta_202306';
        return {
          "fileName": "XT_RCL01_PasajerosFormaPagoRuta_202306",
          "type": "PDF",
          "typeDataSource": "CONN",
          "connect": "TICKETING",
          "params": {
          }
        }
      }
      default: {
        return {
          "message": "No esta en el rango de parametros"
        }
      }
    }
  }

  renderFileInTemplate() {
    this.descargar = true;
    if (this.fechaRango) {
      this.api.downloadImageDiscountReports(this.evaluarFormulario())
        .subscribe(
          {
            next: (value: Blob) => {
              if (value.size <= 1000) {
                this.urlFile = '';
                this.utils.openInfoAlert("No existen datos")
                return;
              }
              const urlCreator = window.URL || window.webkitURL;
              this.urlFile = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(value));
              this.urlFile = this.urlFile.changingThisBreaksApplicationSecurity;
            },
            error: (err: any) => {
              console.log(err)
            },
            complete: () => {
              console.log("La suscripción al observable ha finalizado");
            },
          }
        )
    }
    if (!this.fechaRango) {
      this.enviarFormulario = true;
      setTimeout(() => {
        this.enviarFormulario = false;
      }, 4000)
    }
  }

  renderFileInTemplateDownloads() {
    this.api.downloadImageDiscountReports(this.evaluarFormulario())
      .subscribe(
        {
          next: (value: Blob) => {
            const urlCreator = window.URL || window.webkitURL;
            this.urlFileCopy = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(value));
            const url = URL.createObjectURL(value);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.filname}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
          },
          error: (err: any) => {
            console.log(err)
          },
          complete: () => {
            console.log("La suscripción al observable ha finalizado");
          },
        }
      )
  }
}
