import { Component, Injector, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../../../serivces/auth-service/auth-service.service';
import { UtilsService } from '../../../myUtils/utils.service';
import { LoginServiceService } from '../../../serivces/login-service/login-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';
import { sha256, sha224 } from 'js-sha256';
import { AuthAntifraudeService } from '../../antifraudes/auth-antifraude/services/auth-antifraude.service';
import { ComponentFactoryResolver } from '@angular/core';
import { SideBarComponent } from 'src/app/shared/side-bar/side-bar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  passwordVisible = false;
  password?: string;
  errorMensaje: string | undefined;
  year = new Date().getFullYear();
  errorTip: string = "¡Por favor, ingresar su contraseña!";
  array = [
    'Plataforma de recaudo electrónico ABT, Flexible, con múltiples medios de pago para gestionar los servicios de tu entidad.',
    'Sistema integrado con la billetera electrónica, Core banking, sistemas de control de flota y sistema de información al usuario.',
    'Sistema basado en cuenta de usuario y centralizada en la nube.',
  ];

  constructor(
    private fb: FormBuilder,
    private api: AuthServiceService,
    private utils: UtilsService,
    private authService: LoginServiceService,
    private notification: NzNotificationService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private authAntifraudeService: AuthAntifraudeService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  async submitForm() {
    if (this.validateForm.valid) {
      const resp = await this.api.authenticateUser(this.validateForm.value.userName, this.validateForm.value.password);

      switch (resp.status) {
        case this.utils.successMessage:
          //resp.data.user.password = Md5.init(resp.data.user.password);
          this.authService.setAuth(resp.data);
          await this.continue(10);
          break;
        case this.utils.errorMessage:
          if (resp.message == 'Se debe actualizar la contraseña, primer inicio de session') {
            await this.utils.openInfoAlert('La contraseña se debe cambiar para poder iniciar una sesión por primera vez. Actualícela o póngase en contacto con el administrador del sistema o con el personal de soporte técnico.');
            this.router.navigateByUrl('changePassword/first/' + this.validateForm.value.userName);
            break
          }
          await this.utils.openErrorAlert(this.utils.errorLogin);
          break;
        case this.utils.failMessage:
          if (resp.message == 'Se debe actualizar la contraseña, dias caducados') {
            await this.utils.openInfoAlert(resp.message);
            this.router.navigateByUrl('changePassword/expiration/' + this.validateForm.value.userName);
            break
          }
          if (resp.message == 'Tiene un cambio de contraseña activo') {
            await this.utils.openInfoAlert('Tiene un cambio de contraseña activo, por favor continúe con el proceso de cambio de contraseña o comuníquese con el equipo de soporte');
            this.router.navigateByUrl('forget');
            break
          }
          this.errorMensaje = resp.message;
          await this.utils.openErrorAlert(this.utils.errorLogin);
          break;
        default:
          //this.setError(this.utils.errorGeneralMessage);
          break;
      }
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          if (control.errors?.['required']) {
            this.errorTip = "¡Por favor, ingresar su contraseña!";
          }
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  async executeSidebarMethods() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SideBarComponent);
    const componentRef = componentFactory.create(this.injector);

    // Accede a los métodos del componente SideBarComponent a través de la instancia componentRef.instance
    await componentRef.instance.chargeModules();
    componentRef.destroy(); // Destruye la instancia del componente después de ejecutar los métodos necesarios
  }

  async continue(limite: number) {
    // Desactivar menu antifraude
    this.authAntifraudeService.antifraudeSubject$.next(false);
    await this.executeSidebarMethods()
    if (localStorage.getItem('sidebar') || this.continue(limite - 1)) {
      await this.router.navigateByUrl('/main');
      return;
    }

    return this.continue(limite - 1);
  }
}
