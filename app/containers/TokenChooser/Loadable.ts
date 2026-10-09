/**
 *
 * Asynchronously loads the component for TokenChooser
 *
 */

// @ts-expect-error react-loadable@4.0.5 ships no type declarations and there
// is no ambient declaration for it in this project; it is a plain
// React 15-compatible HOC at runtime.
import Loadable from 'react-loadable';
import LoadingIndicator from 'components/LoadingIndicator';

export default Loadable({
  // @ts-expect-error ./index is still a .jsx module without type declarations;
  // webpack resolves the dynamic import at runtime.
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
