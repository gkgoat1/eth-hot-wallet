/**
*
* WelcomeText
*
*/

import React from 'react';
import styled from 'styled-components';

const H1 = styled.h1`
  font-size: 22px;
  color: rgba(0, 0, 0, 0.55);
  font-weight: 400;
`;

const H2 = styled.h2`
font-size: 16px;
margin-top:30px;
color: #b9b9b9;
font-weight: 400;
`;

// SAFETY: styled-components v2's bundled typings resolve against @types/react
// 19 in this pnpm layout while app code resolves @types/react 15, so styled
// tags fail the React 15 JSX checker. Runtime behavior is unchanged; the casts
// only re-expose the styled tags as JSX components.
const H1Any = H1 as any;
const H2Any = H2 as any;

function WelcomeText() {
  return (
    <div>
      <H1Any>Welcome to ETH Hot Wallet <br />To begin, create or restore Ethereum wallet<br /></H1Any>
      <H2Any>
        ETH Hot wallet is a zero client. Connection to Ethereum network is made via infura / local node. <br />
        Keystore is encrypted using the password. When the wallet is locked, you can only view balances. <br />
        All keys are saved inside the browser and never sent.
      </H2Any>
    </div>
  );
}

(WelcomeText as any).propTypes = {

};

export default WelcomeText;
