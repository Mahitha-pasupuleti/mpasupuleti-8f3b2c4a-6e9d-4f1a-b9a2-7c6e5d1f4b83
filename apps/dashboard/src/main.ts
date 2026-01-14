import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { appRoutes } from './app/app.routes.js';
import { App } from './app/app.js';
import { AuthInterceptor } from './app/services/auth.interceptor.js';

bootstrapApplication(App, {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(),

    // 🔐 Attach JWT automatically to all API calls
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
}).catch(err => console.error(err));
