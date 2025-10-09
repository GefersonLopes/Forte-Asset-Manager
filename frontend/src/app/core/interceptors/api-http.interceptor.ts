import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';
import { ErrorMapperService } from '../services/error-mapper.service';

export const apiHttpInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const mapper = inject(ErrorMapperService);
  const isAbs = /^https?:\/\//i.test(req.url);
  const url = isAbs
    ? req.url
    : `${environment.apiBaseUrl}${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  const cloned = req.clone({ url });
  return next(cloned).pipe(
    catchError((err: HttpErrorResponse) => {
      const msg =
        typeof err.error === 'string'
          ? err.error
          : Array.isArray(err.error?.message)
            ? err.error.message.join('\n')
            : (err.error?.message ?? err.statusText ?? 'Erro inesperado.');

      mapper.show(err.status, msg);

      return throwError(() => err);
    }),
  );
};
