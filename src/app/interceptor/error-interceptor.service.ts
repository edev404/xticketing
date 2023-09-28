import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {LoginServiceService} from '../serivces/login-service/login-service.service';
import Swal from 'sweetalert2';
import {UtilsService} from '../myUtils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor{

  constructor(private router: Router, private authService: LoginServiceService, private utils: UtilsService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        Swal.fire(this.utils.getInfoModalOptions('Su sesión ha expirado.', 'Información'))
          .then(value => {
            if (value) {
              this.authService.closeSession();
            }
          });
        setTimeout(() => {
          this.authService.closeSession();
        }, 500);
      }
      return throwError(err);
    }));
  }
  
}
