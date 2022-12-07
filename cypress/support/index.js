// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:

export const EMAIL = 'admin@admin.com';
export const PASSWORD = 'test2018';
export const API_URL = Cypress.env('API_URL') || 'http://localhost:8000/v1/';

import './commands';
