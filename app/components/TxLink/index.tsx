/**
*
* TxLink
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Span = styled.span`
overflow-wrap: break-word;
`;

// SAFETY: styled-components v2's bundled typings resolve against @types/react
// 19 in this pnpm layout while app code resolves @types/react 15, so styled
// tags fail the React 15 JSX checker. Runtime behavior is unchanged; the cast
// only re-exposes the styled tag as a JSX component.
const SpanAny = Span as any;

interface TxLinkProps {
  tx?: string;
  explorer?: string;
}

function TxLink(props: TxLinkProps) {
  const { tx, explorer } = props;
  if (explorer) {
    return (
      <a href={`${explorer}${tx}`} target="_blank" rel="noopener">
        <SpanAny>{tx}</SpanAny>
      </a>
    );
  }
  return (<SpanAny>{tx}</SpanAny>);
}

(TxLink as any).propTypes = {
  tx: PropTypes.string,
  explorer: PropTypes.string,
};

export default TxLink;
