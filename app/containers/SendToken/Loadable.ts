/**
 *
 * Asynchronously loads the component for SendToken
 *
 */

// @ts-expect-error react-loadable@4.0.5 ships no type declarations and there
// is no ambient declaration for it in this project; it is a plain
// React 15-compatible HOC at runtime.
import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
