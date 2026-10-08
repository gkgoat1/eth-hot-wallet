/**
*
* FaucetDescription
*
*/

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TxLink from 'components/TxLink';

const Span = styled.span`
  overflow-wrap: break-word;
`;

interface FaucetDescriptionProps {
  tx?: string;
  text?: string;
}

function FaucetDescription(props: FaucetDescriptionProps) {
  const { tx, text } = props;

  const explorer = 'https://ropsten.etherscan.io/tx/';
  const TxLinkProps = { tx, explorer };

  return (
    <Span>
      {text}
      <br />
      <TxLink {...TxLinkProps} />
    </Span>
  );
}

// SAFETY: propTypes is a React runtime field; without @types/react the plain
// function type has no such property, so the cast only re-exposes it.
(FaucetDescription as any).propTypes = {
  tx: PropTypes.string,
  text: PropTypes.string,
};

export default FaucetDescription;
