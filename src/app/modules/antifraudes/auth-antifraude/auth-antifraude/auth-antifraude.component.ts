import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Services
import { AuthAntifraudeService } from '../services/auth-antifraude.service';
import { LoginServiceService } from '../../../../serivces/login-service/login-service.service';
import { UtilsService } from 'src/app/myUtils/utils.service';

// Interfaces
import { IUser, IAuthAntifraude } from '../interfaces/authAntifraude.interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-antifraude',
  templateUrl: './auth-antifraude.component.html',
  styleUrls: ['./auth-antifraude.component.scss']
})
export class AuthAntifraudeComponent {

  isVisible: boolean = false;
  isRestore: boolean = false;
  errorTip1: string = "Por favor ingresar su contraseña!";
  errorTip2: string = "Por favor ingresar su contraseña!";
  errorTip3: string = "Por favor ingresar su confirmacion de contraseña!";
  msgCreate: string = 'Por favor crear su segunda contraseña para el módulo de antifraude';
  msgRestore: string = 'Por favor dijite los campos para restaurar su segunda contraseña para el módulo de antifraude';


  private userServiceSubscription: Subscription | undefined;

  // Variable para ocultar y mostrar contraseña
  passwordVisible = false;

  // Formulario reactivo
  form!: FormGroup;
  passwordForm!: FormGroup;

  constructor(private authAntifraudeService: AuthAntifraudeService,
    private loginServiceService: LoginServiceService,
    private fb: FormBuilder,
    private utils: UtilsService,
    private router: Router) {
    const auth = this.loginServiceService.getAuth();
    this.form = this.fb.group({
      password: [null, [Validators.required, Validators.minLength(5)]]
    });
    this.passwordForm = this.fb.group({
      passwordActual: [null, [Validators.required, Validators.pattern("^(?=\\w*\\d)(?=\\w*[A-Z])(?=\\w*[a-z])\\S{5,}$")]],
      password: [null, [Validators.required, Validators.pattern("^(?=\\w*\\d)(?=\\w*[A-Z])(?=\\w*[a-z])\\S{5,}$")]],
      passwordconfirmar: [null, [Validators.required, Validators.pattern("^(?=\\w*\\d)(?=\\w*[A-Z])(?=\\w*[a-z])\\S{5,}$")]]
    });
    console.log(auth)
    this.userServiceSubscription = this.utils.subjectPasswordBehavior.subscribe(
      (subjectPasswordBehavior) => {
        this.isRestore = subjectPasswordBehavior || false;
        this.isVisible = true;
      }
    );
    if (auth.validador == 'ANTIFRAUDE') {
      this.isVisible = true;
    } else {
      this.isVisible = false;
    }
  }

  /**
   * Ingresar al modulo antifraude con segunda clave
   */
  async submit() {
    if (this.form.invalid) {
      this.utils.validateForm(this.form);
      return;
    }
    // Obtener formulario
    const data: IAuthAntifraude = this.form.value;
    // Obtener el usuario
    const user: IUser = this.loginServiceService.getAuth();
    // Agregar atributo username a user
    data.user = user.user.username;

    // Realizar petición para validar segunda contraseña
    const response = await this.authAntifraudeService.authenticateUserSecondPassword(data);

    switch (response.status) {
      case this.utils.successMessage:
        // Si la segunda contraseña es correcta = permitir al usuario acceder al módulo de Antifraude y habilitar todas sus opciones respectivas.
        await this.continue();
        break;
      case this.utils.failMessage:
        // Si se coloca la contraseña incorrecta mandar mensaje de alerta
        if (response.message.includes('contraseña incorrecta')) {
          await this.utils.openErrorAlert(`Segunda clave incorrecta, ¡vuelva a intentarlo!`);
          return;
        }
        // Si se encuentra bloqueado el usuario mandar mensaje de error desde el backend
        else if (response.message.includes('bloqueado')) {
          await this.utils.openErrorAlert(response.message);
          return;
        }
        await this.utils.openErrorAlert(response.message);
        break;
      case this.utils.errorMessage:
        await this.utils.openErrorAlert(response.message);
        break;
      default:
        break;
    }
  }

  /**
   * Redirigir al usuario al modulo antifraude
   */
  async continue(): Promise<void> {
    /** Ruta por defecto si no encuentra la variable en el localStorage */
    let path: string = 'controls/search';
    /** Obtenemos el path desde el localStorage */
    const rutaAntifraude = localStorage.getItem('rutaAntifraude');
    /** Validamos que se obtenga el path y actualizamos el path */
    if (rutaAntifraude != null) {
      rutaAntifraude && rutaAntifraude.includes('undefined') ? path : path = rutaAntifraude;
    }
    // Activar menu antifraude
    await this.authAntifraudeService.antifraudeSubject$.next(true);
    // Redirigir al modulo antifraude
    await this.router.navigateByUrl(`/main/antifraude/${path}`);
  }

  /**
   * Resetear el formulario
   */
  cancel(): void {
    this.form.reset();
    // Redirigir al home
    this.router.navigateByUrl('/main');
  }

  cancelPassword(): void {
    this.isVisible = false;
  }

  async createSecondPassword() {
    let form = this.passwordForm;
    const auth = this.loginServiceService.getAuth();
    if (form.value.password != form.value.passwordconfirmar) {
      form.controls['password'].setErrors({ notEquals: true });
      form.controls['passwordconfirmar'].setErrors({ notEquals: true });
      return
    }
    const resp = await this.authAntifraudeService.restorePassword({
      user: auth.user.username,
      password: form.value.passwordconfirmar,
      passgen: form.value.passwordActual
    });
    if (resp.status === this.utils.successMessage) {
      await this.utils.openSuccessAlert(resp.message);
      this.isVisible = false;
      form.reset();
    } else {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async restoreSecondPassword() {

  }

  error() {
    if (this.passwordForm.invalid) {
      Object.values(this.passwordForm.controls).forEach(control => {
        if (control.invalid) {
          if (control.errors?.['pattern']) {
            this.errorTip1 = "La contaraseña digitada debe tener minimo 5 dijitos una mayuscula, una minuscula y un numero";
            this.errorTip2 = "La contaraseña digitada debe tener minimo 5 dijitos una mayuscula, una minuscula y un numero";
            this.errorTip3 = "La contaraseña digitada debe tener minimo 5 dijitos una mayuscula, una minuscula y un numero";
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
          if (control.errors?.['notEquals']) {
            this.errorTip2 = "Los campos no coinciden";
            this.errorTip3 = "Los campos no coinciden";
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        }
      });
    }

  };

}
