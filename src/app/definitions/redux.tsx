import { INotification } from 'app/definitions/messageBar';
import { IPaginatedMeta, NormalizedResults } from './api';
import { ICampaign } from './campaign';
import { IDomain } from './domain';
import { IList } from './list';
import { IMember } from './member';
import { IMessage } from './message';
import { IOrganization } from './organization';
import { ISegment, ISegmentMetaRedux } from './segment';
import { IAudience, IAudienceImport } from './audience';
import { ISubscriber } from './subscriber';
import { ITeam } from './team';
import { ITemplate } from './template';
import { IOrgUser, IUser } from './user';
import { IClient } from './client';
import { IView } from './view';
import { ISuppressedEmail, ISuppressionList, ISuppressionListImport } from './suppressionList';
import { ISubmissionForm, IWelcomeMessage } from './submissionForm';
import { IBulkDonationImport } from './payments';

interface PaginatedResponse<T> {
  byId: NormalizedResults<T>;
  meta: IPaginatedMeta;
}

export interface IRedux {
  activeOrg: string;
  campaign: ICampaign;
  campaigns: PaginatedResponse<ICampaign>;
  domains: PaginatedResponse<IDomain>;
  list: IList;
  listMembers: PaginatedResponse<IMember>;
  lists: PaginatedResponse<IList>;
  message: IMessage;
  messages: PaginatedResponse<IMessage>;
  campaignMessages: PaginatedResponse<IMessage>;
  notification: INotification;
  organization: IOrganization;
  organizations: NormalizedResults<IOrganization>;
  segment: ISegment;
  segmentMembers: PaginatedResponse<ISubscriber>;
  audience: IAudience;
  audiences: PaginatedResponse<IAudience>;
  audienceMembers: PaginatedResponse<ISubscriber>;
  audienceImports: PaginatedResponse<IAudienceImport>;
  segmentMeta: ISegmentMetaRedux;
  segments: PaginatedResponse<ISegment>;
  subscribers: PaginatedResponse<ISubscriber>;
  tags: any;
  teams: ITeam[];
  templates: PaginatedResponse<ITemplate>;
  user: IUser;
  users: IOrgUser[];
  clients: PaginatedResponse<IClient>;
  client: IClient;
  view: IView;
  suppressionLists: PaginatedResponse<ISuppressionList>;
  suppressionListMembers: PaginatedResponse<ISuppressedEmail>;
  suppressionListImports: PaginatedResponse<ISuppressionListImport>;
  bulkDonationImports: PaginatedResponse<IBulkDonationImport>;
  submissionForms: PaginatedResponse<ISubmissionForm>;
  welcomeMessages: PaginatedResponse<IWelcomeMessage>;
}
