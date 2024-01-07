import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler, Injectable } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CookieService } from 'ngx-cookie-service';
import { NetworkRequestInterceptor } from './intercepters/network-request.interceptor';
import { environment } from '../environments/environment';
import * as Raven from 'raven-js';
import { RavenErrorHandler } from './services/raven-error-handler';
import { ToastrModule } from 'ngx-toastr';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { BlockUIModule } from 'ng-block-ui';
import { BlockTemplateComponent } from './modules/assessment/modules/paper/block-template/block-template.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

Raven
  .config('https://c71f94f159184f3faf2bca56b2947cbd@o387950.ingest.sentry.io/5224010')
  .install();

export function provideErrorHandler() {
  if (environment.production) {
    return new RavenErrorHandler();
  } else {
    return new ErrorHandler();
  }
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    LayoutModule,
    NgxSliderModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 1000,
      // positionClass: 'toast-bottom-full-width',
      preventDuplicates: true,
      maxOpened: 1
    }),
    BlockUIModule.forRoot({template: BlockTemplateComponent}),
    FormsModule,
    RouterModule
  ],
  entryComponents: [
    BlockTemplateComponent
  ],
  providers: [CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NetworkRequestInterceptor,
      multi: true
    },

    {
      provide: ErrorHandler,
      useFactory: provideErrorHandler
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
