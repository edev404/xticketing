import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { es_ES } from 'ng-zorro-antd/i18n';
import { DatePipe, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AntDesignModule } from './ant-design.module';
import { ErrorInterceptorService } from './interceptor/error-interceptor.service';
import { JwtInterceptorService } from './interceptor/jwt-interceptor.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
registerLocaleData(es);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    AntDesignModule,
    NgIdleKeepaliveModule.forRoot()
  ],
  providers: [
    {
      provide: NZ_I18N,
      useValue: es_ES
    },
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
