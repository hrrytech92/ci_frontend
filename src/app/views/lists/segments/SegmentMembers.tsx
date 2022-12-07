import { ISubscriber } from 'app/definitions/subscriber';
import { formatDateTime } from 'app/helpers/date';
import React from 'react';
import { Table, Button } from 'semantic-ui-react';

type OwnProps = {
  members: ISubscriber[];
  push(url: string): void;
  orgId: string;
  showMore: boolean;
  loadMore(): void;
};

const SegmentMembers: React.FunctionComponent<OwnProps> = ({
  members,
  push,
  orgId,
  showMore,
  loadMore,
}) => {
  return members.length > 0 ? (
    <Table className="bootstrapTableFix" basic="very" selectable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Email</Table.HeaderCell>
          <Table.HeaderCell>Subscribe Date</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {members.map(member => (
          <Table.Row
            key={member.id}
            onClick={() => {
              push(`/org/${orgId}/subscribers/${member.id}`);
            }}
          >
            <Table.Cell>{member.email}</Table.Cell>
            <Table.Cell>{formatDateTime(member.created_on)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      {showMore && (
        <Table.Footer>
          <Table.Row>
            <Table.Cell colSpan={7}>
              <Button onClick={loadMore} fluid content="Load More" />
            </Table.Cell>
          </Table.Row>
        </Table.Footer>
      )}
    </Table>
  ) : (
    <div>No members in this segment</div>
  );
};

export default SegmentMembers;
