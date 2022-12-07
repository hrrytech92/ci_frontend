import { IRedux } from 'app/definitions/redux';
import { getSuppressionListOptions } from 'app/state/suppression-lists/selectors';
import { showError, showSuccess } from 'app/state/notifications/actions';
import {
  getFileSignedUrl,
  triggerFileUpload,
  uploadFileToSignedUrl,
} from 'app/state/suppression-lists/api';
import { ReduxFormDropdown } from 'app/views/messages/ReduxFormInput';
import * as React from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { Field, InjectedFormProps, reduxForm } from 'redux-form';
import { Button, DropdownItemProps, Form, Header, Icon, Segment } from 'semantic-ui-react';

interface IProps {
  getFileSignedUrl: typeof getFileSignedUrl;
  uploadFileToSignedUrl: typeof uploadFileToSignedUrl;
  triggerFileUpload: typeof triggerFileUpload;
  showError: typeof showError;
  showSuccess: typeof showSuccess;
  onSuccess: () => void;
  suppressionListOptions?: DropdownItemProps[];
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

  upload = async ({ suppression_lists }) => {
    const { file } = this.state;

    // @ts-ignore
    const url = await this.props.getFileSignedUrl({
      original_name: file.name,
      suppression_lists,
    });

    // @ts-ignore
    await this.props.uploadFileToSignedUrl(url.presigned_url, file);
    // @ts-ignore
    await this.props.triggerFileUpload(url.id, {
      uploaded: true,
      size: file.size,
    });
    this.props.onSuccess();
    this.props.showSuccess('Upload Queued for Processing!');
  };

  render() {
    const { file } = this.state;
    const { suppressionListOptions, handleSubmit, submitting } = this.props;

    return (
      <div className="bulk-import-contain">
        {file ? (
          <Form onSubmit={handleSubmit(this.upload)}>
            <Field
              label="Suppression Lists"
              selection
              multiple
              options={suppressionListOptions}
              name="suppression_lists"
              component={ReduxFormDropdown}
            />

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

const formName = 'BulkImportForm';
const ConnectedBulkImport = connect<{}, {}>(
  (state: IRedux) => ({
    suppressionListOptions: getSuppressionListOptions(state),
  }),
  {
    getFileSignedUrl,
    uploadFileToSignedUrl,
    triggerFileUpload,
    showError,
    showSuccess,
  },
)(BulkImport);

export default reduxForm<{}, $FixMe>({ form: formName })(ConnectedBulkImport);
