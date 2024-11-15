import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
//import { provideStorage, getStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
             provideRouter(routes),
             provideAnimationsAsync(), 
             provideFirebaseApp(() => initializeApp({"projectId":"clinicaonline-27fd8",
                                                      "appId":"1:919321728060:web:fb7c80ed319f4dc8775f39",
                                                      "storageBucket":"clinicaonline-27fd8.firebasestorage.app",
                                                      // "locationId":"southamerica-east1",
                                                      "apiKey":"AIzaSyDWkq7gVfOEcz-gXSiDI72HUMg7KhrDwp4",
                                                      "authDomain":"clinicaonline-27fd8.firebaseapp.com",
                                                      "messagingSenderId":"919321728060"})), 
              provideAuth(() => getAuth()),
              provideFirestore(() => getFirestore(),
              )]
};
// provideStorage(() => getStorage())