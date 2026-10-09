/**
*
* NetworkLabel
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';


interface NetworkLabelProps {
  loading?: boolean;
  error?: object | string | boolean;
  networkName?: string;
  blockNumber?: number;
}

function NetworkLabel(props: NetworkLabelProps) {
  const { loading, error, networkName, blockNumber } = props;
  if (loading) {
    return <div> Loading Network</div>;
  }

  if (error !== false) {
    return <div> {error} </div>;
  }

  // SAFETY: when `error === false` the caller always provides a networkName;
  // the cast only narrows the optional prop for the React 15 typings.
  const networkNameStr = (networkName as string).replace(/_/g, ' ');
  if (networkName !== '') {
    return (
      <div>
        Network Name:{networkNameStr}
        <br />
        blockNumber: {blockNumber}
      </div>
    );
  }

  return null;
}

(NetworkLabel as any).propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
  ]),
  networkName: PropTypes.string,
  blockNumber: PropTypes.number,
};

export default NetworkLabel;
