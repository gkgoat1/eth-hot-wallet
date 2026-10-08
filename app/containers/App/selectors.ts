import { createSelector } from 'reselect';

const selectRoute = (state: { get: (k: string) => unknown }) => state.get('route');

const makeSelectLocation = () =>
  createSelector(selectRoute, (routeState) =>
    (routeState as { get: (k: string) => { toJS: () => unknown } }).get('location').toJS(),
  );

export { makeSelectLocation };
