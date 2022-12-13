import { IRedux } from 'app/definitions/redux';
import { showError, showSuccess } from 'app/state/notifications/actions';
import {
  getFileSignedUrl,
  triggerFileUpload,
  uploadFileToSignedUrl,
} from 'app/state/payments/api';
import { ReduxFormDropdown } from 'app/views/messages/ReduxFormInput';
import * as React from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { Field, InjectedFormProps, reduxForm } from 'redux-form';
import { Button, Form, Header, Icon, Segment } from 'semantic-ui-react';

interface IProps {
  getFileSignedUrl: typeof getFileSignedUrl;
  uploadFileToSignedUrl: typeof uploadFileToSignedUrl;
  triggerFileUpload: typeof triggerFileUpload;
  showError: typeof showError;
  showSuccess: typeof showSuccess;
  onSuccess: () => void;
}

interface IState {
  file: any;
}

const paymentProcessorOptions = [
  { key: 'ANEDOT', text: 'anedot', value: 'ANEDOT' },
  { key: 'WINRED', text: 'WinRed', value: 'WINRED' },
  { key: 'REVV', text: 'Revv', value: 'REVV' },
];

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

  upload = async ({ payment_processor }) => {
    const { file } = this.state;

    // @ts-ignore
    const url = await this.props.getFileSignedUrl({
      original_name: file.name,
      payment_processor: payment_processor,
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
    const { handleSubmit, submitting } = this.props;

    return (
      <div className="bulk-import-contain">
        {file ? (
          <Form onSubmit={handleSubmit(this.upload)}>
            <Field
              label="Payment Processor"
              selection
              options={paymentProcessorOptions}
              name="payment_processor"
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

const formName = 'BulkDownloadImportForm';
const ConnectedBulkImport = connect<{}, {}>(
  (state: IRedux) => ({}),
  {
    getFileSignedUrl,
    uploadFileToSignedUrl,
    triggerFileUpload,
    showError,
    showSuccess,
  },
)(BulkImport);

export default reduxForm<{}, $FixMe>({ form: formName })(ConnectedBulkImport);
