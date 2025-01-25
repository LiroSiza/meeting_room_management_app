import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import localeEs from '@angular/common/locales/es';
import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),importProvidersFrom(HttpClientModule),{ provide: LOCALE_ID, useValue: 'es' }]
};

// Registra el locale español
registerLocaleData(localeEs, 'es');