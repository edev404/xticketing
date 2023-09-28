import { Component, EventEmitter, OnInit, Output, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/myUtils/utils.service';
import { ApiServiceUserAdmin } from '../service/user.admin.api';
import { User } from "../models/user";
import { Profile } from '../models/profiles';
import * as bcrypt from 'bcryptjs';
import { sha256, sha224 } from 'js-sha256';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit, OnDestroy {
  @Output() userCreate = new EventEmitter<any>()
  @Output() userEdit = new EventEmitter<any>()
  @Input() idUser!: number | null;


  user!: User;
  validateForm!: FormGroup;
  profiles: Array<any> = [];
  generatePassword!: string;
  characters!: string;
  title: string = "Crear usuario"
  showPassword: boolean = true;
  isEdit: boolean = false;

  enviadoFormulario: boolean = false;

  errorTip: string = "¡Por favor confirmar la contraseña!";

  // PATH
  private PATHPROFILE = 'profiles';
  private PATH = 'users';

  emails: string = '';

  // Visualizar password
  passwordVisibleOne: boolean = false;
  passwordVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiServiceUserAdmin,
    public utils: UtilsService
  ) {
    this.user = new User(null, null, null, null, null, null, null, null, null, null, null, true, null, false, null);

    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(5), Validators.pattern("^(?=\\w*\\d)(?=\\w*[A-Z])(?=\\w*[a-z])\\S{8,}$")]],
      passwordConfirm: [null, [Validators.required, Validators.minLength(5), Validators.pattern("^(?=\\w*\\d)(?=\\w*[A-Z])(?=\\w*[a-z])\\S{8,}$")]],
      email: [null, [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      profile: [null, [Validators.required]],
      firstName: [null, [Validators.required]],
      secondName: [null],
      lastName: [null, [Validators.required]],
      secondLastName: [null],
      cellPhone: [null, [Validators.required, Validators.minLength(10)]]
    });
  }

  async ngOnInit() {
    if (this.idUser) this.consultUser(this.idUser);
    await this.loadProfiles();
  }

  async consultUser(idUser) {
    this.isEdit = true;
    this.title = 'Editar usuario';
    let form = this.validateForm;

    const resp = await this.api.getUserById(`${this.utils.getBasicEndPoint(`${this.PATH}/${idUser}`)}`);
    if (resp.status === this.utils.successMessage) {
      form.controls['username'].disable();
      // form.controls['password'].disable();
      // form.controls['passwordConfirm'].disable();
      console.log(resp)

      this.user = this.createUserObject(resp.data.user);
      form.controls['firstName'].setValue(this.user.firstName);
      form.controls['secondName'].setValue(this.user.secondName);
      form.controls['lastName'].setValue(this.user.lastName);
      form.controls['secondLastName'].setValue(this.user.secondLastName);
      form.controls['username'].setValue(this.user.username);
      form.controls['profile'].setValue(this.user.profileId);
      form.controls['email'].setValue(this.user.email);
      form.controls['cellPhone'].setValue(this.user.cellPhone);
      // form.controls['password'].setValue(this.user.passwordConfirm)
      // form.controls['passwordConfirm'].setValue(this.user.passwordConfirm)
      // form.controls['passwordConfirm'].setValue(this.user.passwordConfirm)

      this.showPassword = false;
      this.validateForm.get('password')?.setValidators(Validators.nullValidator);
      this.validateForm.get('password')?.updateValueAndValidity()
      this.validateForm.get('passwordConfirm')?.setValidators(Validators.nullValidator);
      this.validateForm.get('passwordConfirm')?.updateValueAndValidity()


    } else if (resp.showAlert) {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  cambioCorreo() {
    const data = this.validateForm.value.email;
    if (!data) {
      this.enviadoFormulario = true;
      return;
    }
    this.enviadoFormulario = false;
  }

  async saveUser() {
    this.enviadoFormulario = true;
    let form = this.validateForm;
    if (form.invalid) {
      Object.values(this.validateForm.controls).map((err) => {
        err.markAsDirty();
        err.updateValueAndValidity({ onlySelf: true });
      })
      return false
    }
    if (form.value.password != form.value.passwordConfirm) {
      await this.utils.openInfoAlert("Las contraseñas ingresadas no coinciden");
      return false
    }
    if (form.value.cellPhone.length > 10) {
      await this.utils.openInfoAlert("El número de teléfono celular debe tener máximo 10 caracteres.");
      return false
    }
    if (!this.showPassword) {
      let generatePassword = this.generatePasswordRand(6, null);
      let generatePasswordNum  = this.generatePasswordRand(2, 'num');
      this.generatePassword = generatePassword + generatePasswordNum
      
      this.user.password = this.generatePassword;
      this.user.passwordConfirm = this.generatePassword;
    } else {
      let hashPassword = sha256(form.value.passwordConfirm)
      this.user.password = hashPassword;
      this.user.passwordConfirm = hashPassword;
    }
    this.user.username = form.value.username;
    this.user.email = form.value.email;
    this.user.profileId = form.value.profile;
    this.user.firstName = form.value.firstName;
    this.user.secondName = form.value.secondName;
    this.user.lastName = form.value.lastName;
    this.user.secondLastName = form.value.secondLastName;
    this.user.cellPhone = form.value.cellPhone;
    this.user.profile = null
    this.user.generatePassword = !this.showPassword ? this.generatePassword : null;

    const response = await this.api.saveUser(JSON.stringify(this.user), this.utils.getBasicEndPoint(this.PATH))
    if (response.status === this.utils.successMessage) {
      await this.utils.openInfoAlert('Estimado usuario recuerde asignar Servicio, Empresa y entidad al usuario, que acaba de crear');
      await this.utils.openSuccessAlert('Usuario creado con éxito.');
      form.reset();
      this.user.canUpdateCellPhone = undefined;
      this.user.canUpdateEmail = undefined;
      this.userCreate.emit(true);
    } else if (response.showAlert) {
      await this.utils.openErrorAlert(response.message);
    }
    return 0
  }

  async editUser() {
    let form = this.validateForm;
    if (form.invalid) {
      Object.values(this.validateForm.controls).map((err) => {
        err.markAsDirty();
        err.updateValueAndValidity({ onlySelf: true });
      })
      return
    }

    this.user.firstName = form.value.firstName;
    this.user.secondName = form.value.secondName;
    this.user.lastName = form.value.lastName;
    this.user.secondLastName = form.value.secondLastName;
    this.user.email = form.value.email;
    this.user.profile = this.user.profile?.id;
    this.user.cellPhone = form.value.cellPhone;
    this.user.profileId = form.value.profile


    let resp = await this.api.updateUser(this.utils.getBasicEndPoint(`${this.PATH}/${this.user.id}`), JSON.stringify(this.user));
    if (resp.status === this.utils.successMessage) {
      this.isEdit = false;
      this.title = "Crear usuario";
      form.controls['username'].enable();
      form.controls['password'].enable();
      form.controls['passwordConfirm'].enable();

      this.userEdit.emit({ tabId: 2, isEdit: true })
      this.validateForm.reset();
      await this.utils.openSuccessAlert(resp.message);
    } else if (resp.showAlert) {
      this.isEdit = false;
      this.title = "Crear usuario";
      this.validateForm.controls['username'].enable()
      this.validateForm.reset();
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async loadProfiles() {
    const response = await this.api.getProfileList(this.utils.getBasicEndPoint(this.PATHPROFILE));

    if (response.status != this.utils.successMessage) {
      await this.utils.openErrorAlert(response.message);
    }
    this.profiles = response.data.profiles;

  }

  show(event) {
    if (event.target.checked) {
      this.showPassword = false;
      this.validateForm.controls['password'].disable()
      this.validateForm.controls['password'].updateValueAndValidity()
      this.validateForm.controls['passwordConfirm'].disable()
      this.validateForm.controls['passwordConfirm'].updateValueAndValidity()
      
    } else {
      this.showPassword = true;
      this.validateForm.controls['password'].enable()
      this.validateForm.controls['password'].updateValueAndValidity()
      this.validateForm.controls['passwordConfirm'].enable()
      this.validateForm.controls['passwordConfirm'].updateValueAndValidity()
    }
  }

  createUserObject(pojo) {
    const result: User = new User(
      pojo.id,
      pojo.firstName,
      pojo.secondName,
      pojo.lastName,
      pojo.secondLastName,
      pojo.username,
      pojo.password,
      pojo.email,
      new Profile(null, null, null, null, null, null),
      '',
      '',
      true,
      pojo.cellPhone,
      pojo.temporalPassword,
      null
    );
    if (pojo.temporalPassword == true) {
      this.generatePassword = this.generatePasswordRand(8, 'rand');
    } else {
      this.generatePassword = pojo.password
    }
    result.passwordConfirm = this.generatePassword;
    result.profile!.id = pojo.profileId;
    result.profile!.name = pojo.profile;
    result.state = pojo.active;
    result.canUpdateEmail = pojo.canUpdateEmail;
    result.canUpdateCellPhone = pojo.canUpdateCellPhone;
    result.profileId = pojo.profileId;
    result.temporalPassword = pojo.temporalPassword;
    return result;
  }

  generatePasswordRand(length, type) {
    var pass = "";
    switch (type) {
      case 'num':
        this.characters = "0123456789";
        break;
      case 'alf':
        this.characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        break;
      case 'rand':
        //FOR ↓
        break;
      default:
        this.characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        break;
    }
    for (let i = 0; i < length; i++) {
      if (type == 'rand') {
        pass += String.fromCharCode((Math.floor((Math.random() * 100)) % 94) + 33);
      } else {
        pass += this.characters.charAt(Math.floor(Math.random() * this.characters.length));
      }
    }
    return pass;
  }

  error() {
    if (this.validateForm.invalid) {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          if (control.errors?.['pattern']) {
            this.errorTip = "La contraseña digitada debe tener al menos 8 caracteres y contener una letra mayúscula, una minúscula y un número.";
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        }
      });
    }

  };

  cancelEditUser() {
    this.isEdit = false;
    this.title = "Crear usuario";
    this.validateForm.controls['username'].enable();
    this.validateForm.controls['password'].enable();
    this.validateForm.controls['passwordConfirm'].enable();
    this.validateForm.reset();
    this.userEdit.emit({ tabId: 2, isEdit: true })
  }

  ngOnDestroy(): void {
    this.isEdit = false;
    this.title = "Crear usuario";
    this.validateForm.controls['username'].enable();
    this.validateForm.controls['password'].enable();
    this.validateForm.controls['passwordConfirm'].enable();
    this.validateForm.reset();
  }
}