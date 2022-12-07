import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MessageBar from './components/message-bar/MessageBar';
import Startup from './components/startup/Startup';
import DashboardContainer from './containers/dashboard/Dashboard';
import LoginContainer from './containers/login/Login';
import './scss/app.scss';

import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/code';
import 'tinymce/plugins/image';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/preview';
import 'tinymce/themes/modern/theme';
import '../../node_modules/tinymce/skins/lightgray/skin.min.css';

function isAuth(user) {
  return user.token;
}

const App = ({ store }) => {
  return (
    <Provider store={store}>
      <Startup>
        <BrowserRouter>
          <Switch>
            <Route
              path="/"
              render={() =>
                isAuth(store.getState().user) ? (
                  <Route component={DashboardContainer} />
                ) : (
                  <Route component={LoginContainer} />
                )
              }
            />
          </Switch>
        </BrowserRouter>
        <MessageBar />
      </Startup>
    </Provider>
  );
};

export default App;
