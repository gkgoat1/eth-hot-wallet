/**
 * app.tsx — entry point (Phase 6: React 18 + router v6).
 *
 * Static assets live in app/public/ and vite copies them verbatim.
 */
import 'sanitize.css/sanitize.css';

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from 'containers/App';

import configureStore from './store';
import { GlobalStyle } from './global-styles';

// Create redux store. Router v6 owns history; the old react-router-redux /
// ConnectedRouter plumbing is gone.
export const store = configureStore({});
const MOUNT_NODE = document.getElementById('app');

const render = () => {
  if (!MOUNT_NODE) {
    throw new Error('Mount node #app not found');
  }
  createRoot(MOUNT_NODE).render(
    <Provider store={store}>
      <BrowserRouter>
        <GlobalStyle />
        <App />
      </BrowserRouter>
    </Provider>,
  );
};

render();
