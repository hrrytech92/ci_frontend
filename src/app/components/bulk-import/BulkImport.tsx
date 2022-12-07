import { IRedux } from 'app/definitions/redux';
import { getListOptions } from 'app/state/lists/selectors';
import { showError, showSuccess } from 'app/state/notifications/actions';
import {
  getFileSignedUrl,
  triggerFileUpload,
  uploadFileToSignedUrl,
} from 'app/state/organizations/api';
import { ReduxFormDropdown, ReduxFormDropdownInput } from 'app/views/messages/ReduxFormInput';
import * as React from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { Field, formValueSelector, InjectedFormProps, reduxForm } from 'redux-form';
import { Button, DropdownItemProps, Form, Header, Icon, Segment } from 'semantic-ui-react';
import './bulkImport.scss';

interface IProps {
  tag: string;
  getFileSignedUrl: typeof getFileSignedUrl;
  uploadFileToSignedUrl: typeof uploadFileToSignedUrl;
  triggerFileUpload: typeof triggerFileUpload;
  showError: typeof showError;
  showSuccess: typeof showSuccess;
  onSuccess: () => void;
  listOptions?: DropdownItemProps[];
}

interface IState {
  file: any;
}
const validationSourceOptions = [
  { value: 'ci', text: 'CIDB' },
  { value: 'zb', text: 'ZeroBounce' },
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

  upload = async ({ lists, tag, validation_source }) => {
    const { file } = this.state;

    // @ts-ignore
    const url = await this.props.getFileSignedUrl({
      original_name: file.name,
      lists,
      tag,
      validation_source,
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
    const { listOptions, handleSubmit, submitting, tag } = this.props;

    return (
      <div className="bulk-import-contain">
        {file ? (
          <Form onSubmit={handleSubmit(this.upload)}>
            <Field
              label="Lists"
              selection
              multiple
              options={listOptions}
              name="lists"
              component={ReduxFormDropdown}
            />

            <Field
              label="Tags"
              placeholder="Tags"
              name="tag"
              dropdownLabel={120 - tag.length}
              component={ReduxFormDropdownInput}
              labelPosition="right"
              maxLength={120}
            />
            <Field
              selection
              label="Email Validation Source"
              name="validation_source"
              options={validationSourceOptions}
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
const formSelector = formValueSelector(formName);
const ConnectedBulkImport = connect<{}, {}>(
  (state: IRedux) => ({
    tag: formSelector(state, 'tag'),
    listOptions: getListOptions(state),
  }),
  {
    getFileSignedUrl,
    uploadFileToSignedUrl,
    triggerFileUpload,
    showError,
    showSuccess,
  },
)(BulkImport);

export default reduxForm<{}, $FixMe>({ form: formName, initialValues: { tag: '' } })(
  ConnectedBulkImport,
);
