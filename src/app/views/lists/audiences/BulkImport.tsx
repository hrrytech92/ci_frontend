import { IRedux } from 'app/definitions/redux';
import { showError, showSuccess } from 'app/state/notifications/actions';
import {
  getFileSignedUrl,
  triggerFileUpload,
  uploadFileToSignedUrl,
} from 'app/state/audiences/api';
import * as React from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { InjectedFormProps, reduxForm } from 'redux-form';
import { Button, DropdownItemProps, Form, Header, Icon, Segment } from 'semantic-ui-react';

interface IProps {
  getFileSignedUrl: typeof getFileSignedUrl;
  uploadFileToSignedUrl: typeof uploadFileToSignedUrl;
  triggerFileUpload: typeof triggerFileUpload;
  showError: typeof showError;
  showSuccess: typeof showSuccess;
  onSuccess: () => void;
  audienceOptions?: DropdownItemProps[];
  listId: number;
  audienceId: number;
}

interface IState {
  file: any;
}

class BulkImport extends React.Component<IProps & InjectedFormProps, IState> {
  state = {
    file: undefined,
  };

  onDrop = acceptedFiles => {
    const file = acceptedFiles[0];
    if (file) {
      this.setState({ file });
    } else {
      this.props.showError('Invalid File Type!');
    }
  };

  upload = async () => {
    const { file } = this.state;
    // @ts-ignore
    const payload = {
      original_name: file.name,
      audience: this.props.audienceId,
    };
    const url = await this.props.getFileSignedUrl(
      payload,
      this.props.listId,
      this.props.audienceId,
    );

    // @ts-ignore
    await this.props.uploadFileToSignedUrl(url.presigned_url, file);
    // @ts-ignore
    await this.props.triggerFileUpload(url.id, this.props.listId, this.props.audienceId, {
      uploaded: true,
      size: file.size,
    });
    this.props.onSuccess();
    this.props.showSuccess('Upload Queued for Processing!');
  };

  render() {
    const { file } = this.state;
    const { handleSubmit, submitting } = this.props;
    return (
      <div className="bulk-import-contain">
        {file ? (
          <Form onSubmit={handleSubmit(this.upload.bind(this))}>
            <Button type="submit" color="green" disabled={submitting}>
              Upload
            </Button>
            <small>{this.state.file.name}</small>
          </Form>
        ) : (
          <Dropzone accept="text/csv" multiple={false} onDrop={this.onDrop}>
            <Segment textAlign="center" padded="very">
              <Header icon>
                <Icon name="upload" />
              </Header>
              <p>Drop a .csv or click to upload</p>
            </Segment>
          </Dropzone>
        )}
      </div>
    );
  }
}

const formName = 'AudienceImportForm';
const ConnectedBulkImport = connect<{}, {}>(
  (state: IRedux, ownProps: IProps) => ({}),
  {
    getFileSignedUrl,
    uploadFileToSignedUrl,
    triggerFileUpload,
    showError,
    showSuccess,
  },
)(BulkImport);

export default reduxForm<{}, $FixMe>({ form: formName })(ConnectedBulkImport);
