import { createSelector } from 'reselect';

// Route state type (router v6 owns routing; react-router-redux's 'route'
// state key no longer exists in the store).
interface RouteState {
  location: unknown;
}

/**
 * STUB — the redux 'route' slice was removed with react-router-redux, so
 * nothing can satisfy this input selector at runtime anymore. makeSelectLocation
 * is kept (returning null) only because its historical unit test still
 * exercises it; new code should read location from React Router v6
 * (useLocation) instead.
 */
const selectRoute = (state: { route?: RouteState }) => state.route;

const makeSelectLocation = () =>
  createSelector(
    selectRoute,
    // SAFETY: the 'route' slice never exists at runtime post-removal, so
    // this selector yields null; previously it returned
    // routeState.get('location').toJS().
    (routeState) => routeState?.location ?? null,
  );

export { makeSelectLocation };
