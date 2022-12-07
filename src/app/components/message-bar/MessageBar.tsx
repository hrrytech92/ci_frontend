import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hide } from '../../state/notifications/actions';
import { INotification } from '../../definitions/messageBar';
import { IRedux } from '../../definitions/redux';
import './messageBar.scss';

interface IProps {
  message?: INotification;
  hide?: (e) => void;
}

class MessageBar extends React.Component<IProps> {
  public componentWillUpdate(props) {
    if (props.message.show && !this.props.message.show) {
      setTimeout(() => {
        this.props.hide(null);
      }, 3000);
    }
  }

  public render() {
    const { type, show, text } = this.props.message;

    return (
      <div
        className={`message-bar-contain
            ${show ? 'show' : ''} ${type === 'success' ? 'success' : 'danger'}`}
      >
        <span className="text">{text}</span>
      </div>
    );
  }
}

const mapStateToProps = (state: IRedux) => ({
  message: state.notification,
});

const mapDispatchToProps = dispatch => bindActionCreators<any, any>({ hide }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MessageBar);
