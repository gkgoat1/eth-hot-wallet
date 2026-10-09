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

// SAFETY: styled-components v2's bundled typings resolve against @types/react
// 19 in this pnpm layout while app code resolves @types/react 15, so styled
// tags fail the React 15 JSX checker. Runtime behavior is unchanged; the cast
// only re-exposes the styled tag as a JSX component.
const SpanAny = Span as any;

interface FaucetDescriptionProps {
  tx?: string;
  text?: string;
}

function FaucetDescription(props: FaucetDescriptionProps) {
  const { tx, text } = props;

  const explorer = 'https://ropsten.etherscan.io/tx/';
  const TxLinkProps = { tx, explorer };

  return (
    <SpanAny>
      {text}
      <br />
      <TxLink {...TxLinkProps} />
    </SpanAny>
  );
}

// SAFETY: propTypes is a React runtime field; without @types/react the plain
// function type has no such property, so the cast only re-exposes it.
(FaucetDescription as any).propTypes = {
  tx: PropTypes.string,
  text: PropTypes.string,
};

export default FaucetDescription;
