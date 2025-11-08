import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import './app/upload/quill/quill-custom-blots';
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
