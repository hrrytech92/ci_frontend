import { fetchOrgs } from 'app/state/organizations/api';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Actions from '../../actions/actions';
import config from '../../config';

interface IState {
  loaded: boolean;
}

interface IDispatchProps {
  setUser?: (user) => void;
  getOrgs?: (params) => void;
  setOrg?: (org) => void;
  children?: any;
}

class Startup extends React.Component<IDispatchProps, IState> {
  public state: IState = {
    loaded: false,
  };

  public async componentDidMount() {
    const token = await localStorage.getItem(config.TOKEN_STORE_NAME);
    if (token) {
      this.props.setUser({ token });
      await this.props.getOrgs({ limit: 200 });
    }
    this.setState({ loaded: true });
  }

  public render() {
    return this.state.loaded ? this.props.children : <p>Loading...</p>;
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators<any, any>(
    {
      setUser: Actions.setUser,
      getOrgs: fetchOrgs,
    },
    dispatch,
  );

export default connect(
  () => ({}),
  mapDispatchToProps,
)(Startup);
