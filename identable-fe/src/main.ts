import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import posthog from 'posthog-js';

posthog.init('phc_GGJoraZGxyQFBi4UiEUy93eu25WKICW7ZO9GRa2eKxl', {
  api_host: 'https://us.i.posthog.com',
});

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
