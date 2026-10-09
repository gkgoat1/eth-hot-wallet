/**
*
* Logo
*
*/

import React from 'react';
import styled from 'styled-components';
import { website } from 'utils/constants';
// @ts-expect-error webpack resolves this via file-loader at runtime; there is
// no ambient module declaration for '*.svg' in this project.
import walletLogo from './hot-wallet.svg';

const Div = styled.div`
  height: 80px;
  font-size: 18px;
  line-height: 80px; 
`;

const Img = styled.img`
  height: 40px;
  line-height: 80px;
  width: 40px;
  margin-right: 10px;
`;

// SAFETY: styled-components v2's bundled typings resolve against @types/react
// 19 in this pnpm layout while app code resolves @types/react 15, so styled
// tags fail the React 15 JSX checker. Runtime behavior is unchanged; the casts
// only re-expose the styled tags as JSX components.
const DivAny = Div as any;
const ImgAny = Img as any;

function Logo() {
  return (
    <DivAny>
      <ImgAny alt="logo" src={walletLogo} />
      <a href={website}>
        ETH Hot Wallet
      </a>
    </DivAny>
  );
}

// SAFETY: propTypes is a React runtime field; without @types/react the plain
// function type has no such property, so the cast only re-exposes it.
(Logo as any).propTypes = {

};

export default Logo;
