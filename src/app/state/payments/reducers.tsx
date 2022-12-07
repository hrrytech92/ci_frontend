import { NormalizedResults } from 'app/definitions/api';
import { IBulkDonationImport } from 'app/definitions/payments';
import {
  FETCH_BULK_DONATION_IMPORTS_SUCCESS,
  FETCH_BULK_DONATION_IMPORT_SUCCESS,
  BulkDonationImportsAction,
  BulkDonationImportAction,
} from 'app/state/payments/actions';
import { normalize, schema } from 'normalizr';
import { combineReducers, Reducer } from 'redux';

type IImportAction = BulkDonationImportsAction | BulkDonationImportAction;

const bulkDonationImportsSchema = new schema.Entity('bulkDonationImports');

const metaInitial = {
  count: 0,
  next: '',
  previous: '',
};

const bulkDonationImportsById: Reducer<NormalizedResults<IBulkDonationImport>, IImportAction> = (
  state = {},
  action,
) => {
  switch (action.type) {
    case FETCH_BULK_DONATION_IMPORT_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload, bulkDonationImportsSchema).entities.bulkDonationImports,
      };
    case FETCH_BULK_DONATION_IMPORTS_SUCCESS:
      return {
        ...state,
        ...normalize(action.payload.results, [bulkDonationImportsSchema]).entities
          .bulkDonationImports,
      };
    default:
      return state;
  }
};

const bulkDonationImportsMeta = (state = metaInitial, action) => {
  switch (action.type) {
    case FETCH_BULK_DONATION_IMPORTS_SUCCESS:
      const { count, next, previous } = action.payload;
      return {
        count,
        next,
        previous,
      };
    default:
      return state;
  }
};

export const bulkDonationImports = combineReducers({
  byId: bulkDonationImportsById,
  meta: bulkDonationImportsMeta,
});
