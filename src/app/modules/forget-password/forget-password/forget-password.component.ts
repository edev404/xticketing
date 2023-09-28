import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { AuthServiceService } from 'src/app/serivces/auth-service/auth-service.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  public returnUrl = '/';
  validateForm!: FormGroup;
  public xportLabel: string | undefined;
  public indexLabel: any;
  year = new Date().getFullYear();
  array = [
    { image:  '../../../assets/illustration_num1.svg', name : 'Plataforma de recaudo electrónico ABT, Flexible, con múltiples medios de pago para gestionar los servicios de tu entidad.'},
    { image: '../../../assets/Illustration_num2.svg', name : 'Sistema integrado con la billetera electrónica, Core banking, sistemas de control de flota y sistema de información al usuario.'},
    { image: '../../../assets/illustrarion_num3.svg', name: 'Plataforma de recaudo electrónico ABT, Flexible, con múltiples medios de pago para gestionar los servicios de tu entidad.'},
  ];

  constructor(private fb: FormBuilder, private router: Router, private api: AuthServiceService, public utils: UtilsService) { 
    this.validateForm = this.fb.group({
      userEmail: [null, [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    });
  }

  ngOnInit(): void {

  }

  async submitForm() {
    let form = this.validateForm
    if (form.valid) {
      const resp = await this.api.enviarCorreo(form.value.userEmail);
      if (resp.status === this.utils.successMessage) {
        await this.utils.openSuccessAlert(resp.message);        
        this.router.navigateByUrl('login');
        form.reset();        
      } else if(resp.showAlert) {
        form.reset();
        await this.utils.openErrorAlert(resp.message);
      }
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  
  volverLogin(){
    this.router.navigate([this.returnUrl]);
  }

}


