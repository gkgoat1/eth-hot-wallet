/**
 * app.js — entry point (Phase 5 vite build).
 *
 * Static assets (favicons, token icons, manifest, .htaccess, CNAME) are no
 * longer imported via webpack `!file-loader`; they live in app/public/ and
 * vite copies them to the build output verbatim. The offline-plugin service
 * worker and webpack module.hot HMR block are removed (vite HMR handles
 * module reload during dev; offline support is out of scope for the port).
 */
import 'babel-polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import 'sanitize.css/sanitize.css';
import { createBrowserHistory as createHistory } from 'history';

// Import root app
import App from 'containers/App';

import configureStore from './store';

// Import CSS reset and Global Styles
import './global-styles';

// Create redux store with history
const initialState = {};
const history = createHistory();
export const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>,
    MOUNT_NODE,
  );
};

render();
