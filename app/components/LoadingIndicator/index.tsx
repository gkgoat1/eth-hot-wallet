/**
*
* LoadingIndicator
*
*/

import React from 'react';
import { Spin } from 'antd';
import styled from 'styled-components';

const Div = styled.div`
position: fixed;
top: 50%;
left: 50%;
/* bring your own prefixes */
transform: translate(-50%, -50%);

`;

// SAFETY: styled-components v2's bundled typings and antd 3's bundled types
// resolve against @types/react 19 in this pnpm layout while app code resolves
// @types/react 15, so these components fail the React 15 JSX checker. At
// runtime they are ordinary React 15-compatible components; the casts only
// re-expose them to the React 15 JSX checker.
const DivAny = Div as any;
const SpinAny = Spin as any;

function LoadingIndicator() {
  return (
    <DivAny>
      <SpinAny size="large" tip="ETH Hot Wallet" />
    </DivAny>
  );
}

// SAFETY: propTypes is a React runtime field; without @types/react the plain
// function type has no such property, so the cast only re-exposes it.
(LoadingIndicator as any).propTypes = {

};

export default LoadingIndicator;
