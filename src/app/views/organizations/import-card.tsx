import { IFileImport } from 'app/definitions/fileImport';
import * as React from 'react';
import { Button, Grid, Message } from 'semantic-ui-react';
import { formatDateTime } from 'app/helpers/date';

interface IProps {
  file: IFileImport;
}

class ImportCard extends React.Component<IProps> {
  public state = {
    toggled: false,
  };

  public toggle = () => {
    this.setState({ toggled: !this.state.toggled });
  };

  public render() {
    const { file } = this.props;
    return (
      <Message>
        <Message.Header>
          {file.original_name} - {formatDateTime(file.created_on)} - {file.import_status}{' '}
          <Button onClick={this.toggle} floated="right" size="mini" icon="bars" />
        </Message.Header>
        {this.state.toggled && (
          <Grid>
            <Grid.Row columns={3}>
              <Grid.Column>
                <h5 className="card-title">{file.user.email}</h5>
                <div>List Id's: {file.lists.join(',')}</div>
                <div>Validation Source: {file.validation_source}</div>
                <div>Original Name: {file.original_name}</div>
              </Grid.Column>
              <Grid.Column>
                <h4>Subscriber Stats</h4>
                {Object.keys(file.import_summary).length > 0 ? (
                  <>
                    <div>Total: {file.import_summary.num_rows}</div>
                    <div>Valid: {file.import_summary.num_valid}</div>
                    <div>New: {file.import_summary.num_new}</div>
                    <div>Existing: {file.import_summary.num_existing}</div>
                  </>
                ) : (
                  <div>Nothing Yet</div>
                )}
              </Grid.Column>
              <Grid.Column>
                <h4>List Stats</h4>
                {file.import_summary.list_stats ? (
                  Object.keys(file.import_summary.list_stats).map((key, i) => (
                    <div key={i}>
                      {key} : {file.import_summary.list_stats[key]}
                    </div>
                  ))
                ) : (
                  <div>Nothing Yet</div>
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}
      </Message>
    );
  }
}

export default ImportCard;
