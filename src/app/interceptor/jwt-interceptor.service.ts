import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginServiceService} from '../serivces/login-service/login-service.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor{

  constructor(private authService: LoginServiceService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (token && (req.url.startsWith(environment.api)
      || req.url.startsWith(environment.apiClearing)
      || req.url.startsWith(environment.apiCollect))) {
      req = req.clone({
        setHeaders: {Authorization: `Bearer ${token}`}
      });
    }
    return next.handle(req);
  }
}
// url interceptor para apiTransaction, apiParking
// || req.url.startsWith(environment.apiTransaction)
// || req.url.startsWith(environment.apiParking)
