import { ISeedList } from 'app/definitions/integrations';
import { IList } from 'app/definitions/list';
import { IMessage } from 'app/definitions/message';
import { IRedux } from 'app/definitions/redux';
import { ISegment } from 'app/definitions/segment';
import { ITemplate } from 'app/definitions/template';
import { getList, getListUrl } from 'app/state/lists/selectors';
import { getSeedLists } from 'app/state/seed-lists/selectors';
import { getSuppressionListsForMessage } from 'app/state/suppression-lists/selectors';
import { getSegment, getSegmentUrl } from 'app/state/segments/selectors';
import { getAudience, getAudienceUrl } from 'app/state/audiences/selectors';
import { getTemplate, getTemplateUrl } from 'app/state/templates/selectors';
import { get, toPairs } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Label, Table } from 'semantic-ui-react';
import { ISuppressionList } from 'app/definitions/suppressionList';
import { IAudience } from 'app/definitions/audience';

interface ListProps {
  message: IMessage;
}

interface ReduxProps {
  listUrl: string;
  templateUrl: string;
  segmentUrl?: string;
  audienceUrl?: string;
  seedLists: ISeedList[];
  suppressionLists: ISuppressionList[];
  list: IList;
  segment?: ISegment;
  audience?: IAudience;
  template: ITemplate;
}

function MessageSummaryList(props: ListProps & ReduxProps) {
  const {
    message,
    list,
    segment,
    audience,
    template,
    seedLists,
    listUrl,
    templateUrl,
    segmentUrl,
    audienceUrl,
    suppressionLists,
  } = props;

  return (
    <Table className="bootstrapTableFix" definition>
      <Table.Body>
        <Table.Row>
          <Table.Cell width={2}>Subject</Table.Cell>
          <Table.Cell>{message.subject}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Sender Name</Table.Cell>
          <Table.Cell>{message.sender_name}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Sender Email</Table.Cell>
          <Table.Cell>{message.sender_email}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>List</Table.Cell>
          <Table.Cell>
            <a href={listUrl}>{get(list, 'list_name')}</a>
          </Table.Cell>
        </Table.Row>
        {segment && (
          <Table.Row>
            <Table.Cell>Segment</Table.Cell>
            <Table.Cell>
              <a href={segmentUrl}>{get(segment, 'name')}</a>
            </Table.Cell>
          </Table.Row>
        )}
        {audience && (
          <Table.Row>
            <Table.Cell>Audience</Table.Cell>
            <Table.Cell>
              <a href={audienceUrl}>{get(audience, 'name')}</a>
            </Table.Cell>
          </Table.Row>
        )}
        <Table.Row>
          <Table.Cell>Template</Table.Cell>
          <Table.Cell>
            <a href={templateUrl}>{get(template, 'name')}</a>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Seed Lists</Table.Cell>
          <Table.Cell>
            {seedLists.map((seedList, i) => (
              <div key={i}>{seedList.name}</div>
            ))}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Suppression Lists</Table.Cell>
          <Table.Cell>
            {suppressionLists.map((suppressionList, i) => (
              <div key={i}>{suppressionList.name}</div>
            ))}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Variables</Table.Cell>
          <Table.Cell>
            {toPairs(message.variables).map((variablePair, i) => (
              <Label basic key={i}>
                {variablePair[0]}
                <Label.Detail>{variablePair[1]}</Label.Detail>
              </Label>
            ))}
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
}

export default connect(
  (state: IRedux, ownProps: ListProps): ReduxProps => ({
    list: getList(state, ownProps.message.list),
    segment: getSegment(state, ownProps.message.segment),
    audience: getAudience(state, ownProps.message.audience),
    template: getTemplate(state, ownProps.message.template),
    seedLists: getSeedLists(state, ownProps.message.seed_lists),
    suppressionLists: getSuppressionListsForMessage(state, ownProps.message.suppression_lists),
    listUrl: getListUrl(state, ownProps.message.list),
    templateUrl: getTemplateUrl(state, ownProps.message.template),
    segmentUrl: getSegmentUrl(state, ownProps.message.segment),
    audienceUrl: getAudienceUrl(state, ownProps.message.audience),
  }),
)(MessageSummaryList);
