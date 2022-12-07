import * as React from 'react';
import * as ReactDOM from 'react-dom';
import store from './store';
// import * as Sentry from '@sentry/browser';
// import config from 'app/config';
import App from './app';

// try {
//   Sentry.init({
//     dsn: config.SENTRY_DSN,
//     environment: config.SENTRY_ENV,
//   });
// } catch (e) {
//   console.log('Sentry init failed - ', e);
// }

ReactDOM.render(<App store={store} />, document.getElementById('app'));
