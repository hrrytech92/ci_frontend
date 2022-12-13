import { formatDateTime } from 'app/helpers/date';
import React from 'react';
import { Table, Button } from 'semantic-ui-react';
import { IAudienceImport } from 'app/definitions/audience';

type OwnProps = {
  imports: IAudienceImport[];
  showMore: boolean;
  loadMore(): void;
};

const Audienceimports: React.FunctionComponent<OwnProps> = ({ imports, showMore, loadMore }) => {
  return imports.length > 0 ? (
    <Table className="bootstrapTableFix" basic="very" selectable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell>Original Name</Table.HeaderCell>
          <Table.HeaderCell>Import Status</Table.HeaderCell>
          <Table.HeaderCell>Updated On</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {imports.map(importJob => (
          <Table.Row key={importJob.id}>
            <Table.Cell>{importJob.id}</Table.Cell>
            <Table.Cell>{importJob.original_name}</Table.Cell>
            <Table.Cell>{importJob.import_status}</Table.Cell>
            <Table.Cell>{formatDateTime(importJob.updated_on)}</Table.Cell>
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
    <div>No imports for this audience</div>
  );
};

export default Audienceimports;
