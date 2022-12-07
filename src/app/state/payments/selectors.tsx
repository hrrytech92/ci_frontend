import { IRedux } from 'app/definitions/redux';
import { getActiveOrganization } from 'app/state/organizations/selectors';
import { find, values } from 'lodash';

export function getBulkDonationImports(state: IRedux) {
  const currentOrg = getActiveOrganization(state);
  return values(state.bulkDonationImports.byId)
    .reverse()
    .filter(bdi => {
      return bdi.org_id === currentOrg.id;
    });
}

export function getBulkDonationImport(state: IRedux, bulkDonationImportId) {
  return find(getBulkDonationImports(state), { id: bulkDonationImportId });
}

export const getBulkDonationImportsMeta = (state: IRedux) => state.bulkDonationImports.meta;
