import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/routes/app.routes';
import { RootComponent } from './app/core/root.component';
import { apiHttpInterceptor } from './app/core/interceptors/api-http.interceptor';

bootstrapApplication(RootComponent, {
  providers: [provideHttpClient(withInterceptors([apiHttpInterceptor])), provideRouter(routes)],
}).catch(console.error);
