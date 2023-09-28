import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import { LoginServiceService } from '../serivces/login-service/login-service.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private authService: LoginServiceService, private router: Router,) { 
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.validAuth();
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.validAuth();
  }

  private validAuth(): boolean {
    const token = this.authService.getToken();
    if (token) {
      const time = Math.floor((new Date().getTime() / 1000));
      const payload = JSON.parse(atob(token.split('.')[1]));
      const {exp} = payload;
      
      if (exp > time) {
        return true;
      } else {
        /*Swal.fire(this.utils.getInfoModalOptions('Su sesión ha expirado.', 'Información'))
          .then(value => {*/
            this.authService.closeSession();
          /*});*/
        return false;
      }
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }


}
