import { IRedux } from 'app/definitions/redux';
import { ITeam } from 'app/definitions/team';
import { deleteTeam, getTeams } from 'app/state/organizations/api';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Button, Menu } from 'semantic-ui-react';

interface IProps extends RouteComponentProps<void> {
  teams?: ITeam[];
  getTeams: (params) => ITeam[];
  deleteTeam: (i) => void;
}

class Teams extends React.Component<IProps> {
  public componentDidMount() {
    this.props.getTeams('');
  }

  public render() {
    return (
      <>
        <Menu secondary>
          <Menu.Item position="right">
            <Button disabled color="green" icon="plus" content="Add Team" />
          </Menu.Item>
        </Menu>
        No teams available.
      </>
    );
  }
}

export default connect<{}, {}>(
  (state: IRedux) => ({
    teams: state.teams,
  }),
  {
    deleteTeam: deleteTeam,
    getTeams: getTeams,
  },
)(Teams);
