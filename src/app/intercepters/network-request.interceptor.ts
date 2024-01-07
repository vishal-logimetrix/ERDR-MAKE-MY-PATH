import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
@Injectable()
export class NetworkRequestInterceptor implements HttpInterceptor {

    constructor(public cookie: CookieService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (this.cookie.get('_l_a_t')) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Token ${this.cookie.get('_l_a_t')}`
                }
            });
        }
        return next.handle(request);
    }
}