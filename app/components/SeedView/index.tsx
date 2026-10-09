/**
*
* SeedView
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
// import { generateKeystore } from 'containers/HomePage/actions';

interface SeedViewProps {
  loading?: boolean;
  error?: object | string | boolean;
  seed?: string | boolean;
  password?: string | boolean;
  onGenerateKeystore?: () => void;
}

function SeedView({ loading, error, seed, password, onGenerateKeystore }: SeedViewProps) {
  if (loading) {
    return <div> Loading....</div>;
  }

  if (error !== false) {
    // React 18 types: a bare object isn't a valid ReactNode; render objects as JSON.
    const errorText = typeof error === 'object' ? JSON.stringify(error) : error;
    return <div> Error: {errorText} </div>;
  }

  if (seed !== false) {
    return (
      <div>
        <br />
        Seed:
        <br />
        {seed}
        <br /><br />
        keystore password:
        <br />
        {password}
        <br />
        <button onClick={onGenerateKeystore} >
          Confirm seed
        </button>
      </div>
    );
  }

  return null;
}

(SeedView as any).propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
  ]),
  seed: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  password: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  onGenerateKeystore: PropTypes.func,
};


export default SeedView;
