import { campaignMessages, messages } from 'app/state/messages/reducers';
import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reducer as formReducer } from 'redux-form';
import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { teams } from './reducers/teamReducer';
import { user, users } from './reducers/userReducer';
import { view } from './reducers/viewReducer';
import campaigns from './state/campaigns/reducers';
import domains from './state/domains/reducers';
import { listMembers, lists } from './state/lists/reducers';
import { clients } from './state/clients/reducers';
import { notification } from './state/notifications/reducers';
import { activeOrg, organizations } from './state/organizations/reducers';
import { segments, segmentMembers, segmentMeta } from './state/segments/reducers';
import { audiences, audienceMembers, audienceImports } from './state/audiences/reducers';
import subscribers from './state/subscribers/reducers';
import templates from './state/templates/reducers';
import {
  suppressionListMembers,
  suppressionLists,
  suppressionListImports,
} from './state/suppression-lists/reducers';
import { bulkDonationImports } from './state/payments/reducers';
import { submissionForms, welcomeMessages } from './state/submission-forms/reducers';
import { tags } from './state/tags/reducer';

const store: Store<any> = createStore(
  combineReducers({
    activeOrg,
    campaigns,
    domains,
    form: formReducer,
    listMembers,
    lists,
    segments,
    campaignMessages,
    messages,
    notification,
    organizations,
    segmentMembers,
    segmentMeta,
    audiences,
    audienceMembers,
    audienceImports,
    subscribers,
    tags,
    teams,
    templates,
    user,
    users,
    clients,
    view,
    suppressionLists,
    suppressionListMembers,
    suppressionListImports,
    bulkDonationImports,
    submissionForms,
    welcomeMessages,
  }),
  {},
  composeWithDevTools(applyMiddleware(thunk, promise())),
);

export default store;
