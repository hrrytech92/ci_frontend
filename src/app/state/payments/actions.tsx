import { IPaginated } from 'app/definitions/api';
import { Action } from 'redux';
import { IBulkDonationImport } from 'app/definitions/payments';

export const FETCH_BULK_DONATION_IMPORTS_SUCCESS = 'FETCH_BULK_DONATION_IMPORTS_SUCCESS';
export const FETCH_BULK_DONATION_IMPORT_SUCCESS = 'FETCH_BULK_DONATION_IMPORT_SUCCESS';

export interface BulkDonationImportsAction
  extends Action<typeof FETCH_BULK_DONATION_IMPORTS_SUCCESS> {
  payload: IPaginated<IBulkDonationImport>;
}

export interface BulkDonationImportAction
  extends Action<typeof FETCH_BULK_DONATION_IMPORT_SUCCESS> {
  payload: IBulkDonationImport;
}

export const fetchBulkDonationImportsSuccess = (
  payload: IPaginated<IBulkDonationImport>,
): BulkDonationImportsAction => ({
  payload,
  type: FETCH_BULK_DONATION_IMPORTS_SUCCESS,
});

export const fetchBulkDonationImportSuccess = (
  payload: IBulkDonationImport,
): BulkDonationImportAction => ({
  payload,
  type: FETCH_BULK_DONATION_IMPORT_SUCCESS,
});
