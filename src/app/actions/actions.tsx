import * as fileImport from './fileImport';
import * as listActions from 'app/state/lists/actions';
import * as messageActions from '../state/notifications/actions';
import * as organizationActions from 'app/state/organizations/actions';
import * as segmentActions from '../state/segments/actions';
import * as subscriberActions from 'app/state/subscribers/api';
import * as template from 'app/state/templates/actions';
import * as userActions from './userActions';
import * as viewActions from './viewActions';

export default {
  ...messageActions,
  ...organizationActions,
  ...userActions,
  ...viewActions,
  ...segmentActions,
  ...template,
  ...fileImport,
  ...subscriberActions,
  ...listActions,
};
