import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import { NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  KEY = 'auth';

  constructor(private router: Router, private ngZone:NgZone) {
  }

  getToken() {
    const auth = this.getAuth();
    if (auth) {
      return auth.token;
    }
  }

  setToken(token: any) {
    const auth = this.getAuth();
    if (auth) {
      auth.token = token;
      this.setAuth(auth);
    }
  }

  getAuth() {
    return JSON.parse(localStorage.getItem(this.KEY)!);
  }

  setAuth(data: any) {
    localStorage.setItem(this.KEY, JSON.stringify(data));
  }

  closeSession() {
    localStorage.removeItem('auth');
    localStorage.removeItem('selectedCompany');
    localStorage.removeItem('actionsByModules');
    localStorage.removeItem('actions');
    localStorage.removeItem('pathActive');
    localStorage.removeItem('subActions');
    localStorage.removeItem('entities');
    localStorage.removeItem('selectedEntity');
    localStorage.removeItem('sidebar');
    setTimeout(() => {
      // this.router.navigateByUrl('/login');
      this.ngZone.run(()=>this.navigateTo('/login'));
    }, 500);
  }

  navigateTo(url){
    this.router.navigate([url]);
  }

}
