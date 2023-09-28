import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from "../../../myUtils/utils.service";
import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.scss']
})
export class RestorePasswordComponent implements OnInit {

  validateForm!: FormGroup;
  id!: string|null;

  titulo!:string;
  message!:string;
  messageButton!:string;
  year = new Date().getFullYear();
  passwordVisible:boolean = false;
  passwordVisible2:boolean = false;
  errorTip:string = "¡Por favor confirmar su nueva contraseña!";
  errortip2:string = "¡Por favor ingresar su nueva contraseña!";

  public xportLabel: string | undefined;
  public indexLabel: any;  
  array = [{ image:  '../../../assets/illustration_num1.svg', name : 'Plataforma de recaudo electrónico ABT, Flexible, con múltiples medios de pago para gestionar los servicios de tu entidad.'},
  { image: '../../../assets/Illustration_num2.svg', name : 'Sistema integrado con la billetera electrónica, Core banking, sistemas de control de flota y sistema de información al usuario.'},
  { image: '../../../assets/illustrarion_num3.svg', name: 'Plataforma de recaudo electrónico ABT, Flexible, con múltiples medios de pago para gestionar los servicios de tu entidad.'},];

  constructor(private fb: FormBuilder, private router: Router,private routerActive: ActivatedRoute, private api: AuthServiceService,public utils: UtilsService) {
    this.validateForm = this.fb.group({
      password: [null, [Validators.required, Validators.pattern("^(?=\\w*\\d)(?=\\w*[A-Z])(?=\\w*[a-z])\\S{8,}$")]],
      passwordconfirmar: [null, [Validators.required, Validators.pattern("^(?=\\w*\\d)(?=\\w*[A-Z])(?=\\w*[a-z])\\S{8,}$")]],
      remember: [true]
    });
  }

  ngOnInit(): void {
    this.id = this.routerActive.snapshot.paramMap.get('id');  
    let path = this.router.url.split('/')[1]+'/'+this.router.url.split('/')[2];   
    switch (path) {
      case 'restore/'+this.router.url.split('/')[2]:
        this.titulo = "Restaurar contraseña";
        this.message = "Tu nueva contraseña debe ser diferente a las contraseñas que has usado anteriormente.";
        this.messageButton="Restaurar contraseña";
        break;
      case 'changePassword/first':
        this.titulo = "Crear contraseña";
        this.message = "Has iniciado sesión por primera vez, crea tu nueva contraseña.";
        this.messageButton="Crear contraseña";
        break;
      case 'changePassword/expiration':
        this.titulo = "Actualizar contraseña";
        this.message = "Se debe actualizar la contraseña, porque la contraseña actual ha caducado.";
        this.messageButton = "Actualizar contraseña";
      break
    
      default:
        break;
    }   
  }

  error(){
    if (this.validateForm.invalid) {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          if(control.errors?.['pattern']){
            this.errorTip = "La contraseña debe constar de al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula y un número.";
            this.errortip2 = "La contraseña debe constar de al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula y un número.";
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        }
      });
    }
    
  };

  async submitForm() {
    let form = this.validateForm;
    if (form.valid) {
      if (form.value.password != form.value.passwordconfirmar) {
        this.utils.openErrorAlert('Las contraseñas ingresadas no coinciden.');
        return;
      }

      // const salt = bcrypt.genSaltSync(10);
      // let passHash = bcrypt.hashSync(form.value.passwordconfirmar, salt)
      const resp = await this.api.restorePassword(JSON.stringify({
        data: this.id,
        username: this.routerActive.snapshot.paramMap.get('userName'),
        password: form.value.passwordconfirmar,
        temporalPassword: true
      }));
      if (resp.status === this.utils.successMessage) {
        await this.utils.openSuccessAlert('La contraseña ha sido actualizada exitosamente.');        
        this.router.navigateByUrl('login');
        form.reset();        
      } else if(resp.showAlert) {
        if (resp.message.split(' ')[0] == 'JWT') {
          this.utils.openErrorAlert('El tiempo para cambiar la contraseña de usuario expiró, por favor inténtelo nuevamente o comuníquese con el equipo de soporte');
          form.reset();
          return
        }
        form.reset();
        await this.utils.openErrorAlert(resp.message);
      }
    } else {
      Object.values(form.controls).forEach(control => {
        if (control.invalid) {          
          if(control.errors?.['required']){
            this.errorTip = "Por favor ingresar su confirmacion de contraseña!";
            this.errortip2 = "Por favor ingresar su contraseña!";
          }
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}


