/**
*
* PageFooter
*
*/

import React from 'react';
import { github } from 'utils/constants';
import { Row, Col } from 'antd';
import styled from 'styled-components';

import { StickyFooter } from './sticky';


// SAFETY: styled-components v2 runtime supports `.extend`; the installed
// typings do not expose it, so access it off a widened view of StickyFooter.
const Footer = (StickyFooter as any).extend`
  textAlign: center;
  background: #efeeee;
  color: #5a5a5a;
  padding: 10px;
  font-size: 14px;
`;
// SAFETY: antd 3 / styled-components v2 typings resolve 'react' to a hoisted
// @types/react@19 under pnpm, failing the app's React 15 JSX checker. The
// runtime components are unchanged; these aliases only re-type them.
const FooterAny = Footer as any;

const Span = styled.span`
  color: #b9b9b9;
  margin-top:3px;
`;
// SAFETY: styled-components v2 typings resolve 'react' to a hoisted
// @types/react@19 under pnpm, failing the app's React 15 JSX checker. The
// runtime component is unchanged; this alias only re-types it.
const SpanAny = Span as any;

// SAFETY: antd 3's bundled .d.ts files resolve 'react' to a hoisted
// @types/react@19 under pnpm, whose Component type fails the React 15 JSX
// checker. Runtime components are unchanged; the casts only re-type them.
const RowAny = Row as any;
const ColAny = Col as any;

function PageFooter() {
  return (
    <FooterAny>
      <RowAny>
        <ColAny sm={12} xs={24}>
          {'ETH Hot Wallet - '}
          <a href={github} target="_blank" rel="noopener">
            Ethereum Wallet with ERC20 support (GitHub)
          </a><br />
          Created using: eth-lightwallet, React.js, Ant design...
        </ColAny>

        <SpanAny>
          <ColAny sm={12} xs={24}>
            <a href="https://medium.freecodecamp.org/how-to-build-an-ethereum-wallet-web-app-ac77dcaac573" target="_blank" rel="noopener">
            How to build an Ethereum Wallet guide
            </a>
            <br />
            ETH: 0x97325941fafde5a182e6f7e5475a592ac615a3f2
          </ColAny>
        </SpanAny>

      </RowAny>
    </FooterAny>
  );
}

(PageFooter as any).propTypes = {

};

export default PageFooter;
