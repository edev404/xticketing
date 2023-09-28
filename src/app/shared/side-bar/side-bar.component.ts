import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginServiceService } from 'src/app/serivces/login-service/login-service.service';
import { UserAdminServiceService } from 'src/app/serivces/user-admin/user-admin-service.service';
import { UtilsService } from '../../myUtils/utils.service';
import { AuthAntifraudeService } from '../../modules/antifraudes/auth-antifraude/services/auth-antifraude.service';
import { Router } from '@angular/router';
import { Navbar } from '../models/navbar.interface';
import { ApiServiceService } from 'src/app/serivces/api-service/api-service.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {
  isCollapsed = true;
  isActive!: string;
  navModules: any[] | Navbar[] = [];
  navModulesCopy: any[] | Navbar[] = [];
  categorias: any[] = [];
  modules: any[] = [];
  filtrar: string = '';
  openMap = {
    sub1: false,
    sub2: false,
    sub3: false,
    sub4: false,
    sub5: false,
    sub6: false,
    sub7: false,
    sub8: false,
    sub9: false,
    sub10: false,
  };
  // PATH APIS
  private USERPATH = 'users';

  private userServiceSubscription: Subscription | undefined;

  // Variable para validar si el login se hizo éxitosamente
  loginAntifraudeSuccess: boolean = false;

  constructor(
    private utils: UtilsService,
    private router: Router,
    private authService: LoginServiceService,
    private api: ApiServiceService,
    private apiUser: UserAdminServiceService,
    private authAntifraudeService: AuthAntifraudeService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   * Método de Angular para comprobar expresiones y deteccion de cambios en la vista antes cambiar valores
   */
  ngAfterContentChecked() {
    // Eliminar errores de [ExpressionChangedAfterItHasBeenCheckedError]
    this.changeDetectorRef.detectChanges();
  }

  async ngOnInit() {
    // this.getSelectedNavModule();
    await this.chargeModules();

    this.userServiceSubscription = this.utils.subjectSidebarBehavior.subscribe(
      (subjectSidebarBehavior) => {
        this.isCollapsed = subjectSidebarBehavior;
      }
    );
    this.isCollapsed = true;
    // Se Subscribe para mostrar modulo antifraude en caso de login éxitoso.
    this.authAntifraudeService.antifraudeSubjectBehavior.subscribe(
      (antifraudeSubject: boolean) =>
        (this.loginAntifraudeSuccess = antifraudeSubject)
    );
  }

  // Método para filtrar la barra lateral según el término de búsqueda
  filtrarSidebar() {
    this.navModules = this.navModulesCopy; // Restaurar la lista original antes de aplicar el filtro

    // Verificar si se ha ingresado un término de búsqueda
    if (this.filtrar !== '') {
      const regex = new RegExp(this.filtrar, 'i'); // Expresión regular para coincidencia sin distinción entre mayúsculas y minúsculas
      this.navModules = this.navModules.filter((module) => {
        // Comprobar si el nombre del módulo coincide con el término de búsqueda
        if (regex.test(module.name)) {
          return true; // Mantener el módulo en la lista filtrada
        }

        // Comprobar si alguno de los nombres de las categorías del módulo coincide con el término de búsqueda
        return module.categories.some((category) =>
          this.buscarPorCategoria(category, regex)
        );
      });
    }
  }

  // Función auxiliar para buscar en el nombre de las categorías
  buscarPorCategoria(category, regex) {
    return regex.test(category.category) || regex.test(category.name);
  }

  getSelectedNavModule() {
    const m = this.router.url.split('/');
    if (m.length > 2) {
      this.isActive = m[2];
    }
  }

  openHandler(value: string): void {
    for (const key in this.openMap) {
      if (key !== value) {
        this.openMap[key] = false;
      }
    }
  }

  setPermisos(pathModule: any) {
    // modulo filtrado
    const modul = this.utils.encrypt(JSON.stringify(this.navModules.find((e) => e.path == pathModule.split('/')[0])));
    localStorage.setItem('md-inspector-modu', modul);

    // path seleccionado del modulo
    const pathModuleSelect = JSON.stringify(pathModule.split('/'));
    localStorage.setItem('md-inspector-path', this.utils.encrypt(pathModuleSelect));
  }

  async chargeModules() {
    const auth = this.authService.getAuth();
    const resp = await this.apiUser.getPermissionByUsers(
      this.utils.getBasicEndPoint(`${this.USERPATH}/${auth.user.id}/modules`)
    );
    if (resp.status === this.utils.successMessage) {
      const modules = resp.data.modules;

      let tempModules = await Promise.all(
        modules.map(async (modul) => {
          // se les añade la categoaria y se retorna
          await this.categoriesModule(modul);
          return await modul;
        })
      );
      this.navModules = tempModules;
      // Filtramos esas tablas
      this.navModules = this.navModules.filter(
        (element: Navbar) => element.active != false
      );
      this.navModulesCopy = this.navModules;
      localStorage.setItem('sidebar', JSON.stringify(this.navModules));
    } else if (resp.showAlert) {
      await this.utils.openErrorAlert(resp.message);
    }
  }

  async categoriesModule(modul: any) {
    const auth = this.authService.getAuth();

    if (auth) {
      const response = await this.api.getActionsByModule(
        auth.user.id,
        modul.id
      ); // revisar en el inspeccionador la llamada
      if (response.status === this.utils.successMessage) {
        let categories = response.data.categories;
        // me vuelo a los nietos si el hijo es base
        if (categories[0].category == 'Base') {
          modul.categories = categories[0].actions;
        } else {
          modul.categories = categories;
        }
      } else {
        await this.utils.openErrorAlert(response.message);
      }
    }
  }
  /**
   * Metodo para guardar ruta donde el usuario ha seleccionado para entrar al modulo antifraude
   * @param category: string
   * @param path: string
   */
  optionSelect(category: string, path: string): void {
    localStorage.setItem('rutaAntifraude', `${category}/${path}`);
  }
}
