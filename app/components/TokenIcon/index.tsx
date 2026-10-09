/**
*
* TokenIcon
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Img = styled.img`
  {
    color: #dbd9ff;
    font: 20px Impact;
    text-transform: uppercase;
  }
`;

// SAFETY: styled-components v2's bundled typings resolve against @types/react
// 19 in this pnpm layout while app code resolves @types/react 15, so styled
// tags fail the React 15 JSX checker. Runtime behavior is unchanged; the cast
// only re-exposes the styled tag as a JSX component.
const ImgAny = Img as any;

interface TokenIconProps {
  tokenSymbol?: string;
  size?: number;
}

function TokenIcon({ tokenSymbol, size = 24 }: TokenIconProps) {
  // const { tokenSymbol } = props;

  const iconPath = `token-icons/${tokenSymbol}.png`;

  return (
    <span>
      <ImgAny alt={tokenSymbol} src={iconPath} height={size.toString()} />
    </span>
  );
}

(TokenIcon as any).propTypes = {
  tokenSymbol: PropTypes.string,
  size: PropTypes.number,
};

export default TokenIcon;
