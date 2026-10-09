/**
*
* TokenChooserList
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { List, Switch } from 'antd';
import styled from 'styled-components';
import TokenIcon from 'components/TokenIcon';

// SAFETY: antd 3's bundled types resolve against @types/react 19 in this
// pnpm layout while app code resolves @types/react 15, so every antd class
// component fails JSX validation with spurious errors. At runtime these are
// ordinary React 15-compatible components; the casts only re-expose them to
// the React 15 JSX checker.
const ListAny = List as any;
const SwitchAny = Switch as any;
const ListItem = ListAny.Item;
const ListItemMeta = ListAny.Item.Meta;
/*
tokenList={TokensForNetwork}
selectedTokens={[]}
onTokenToggle={(x) => console.log(x)}
*/

const LeftDiv = styled.div`
.ant-list-item-meta-content{
  text-align:left;
}
`;
// SAFETY: styled-components v2 has no bundled types; the installed
// @types/styled-components resolves against @types/react 19, so styled tags
// fail the React 15 JSX checker. Runtime behavior is unchanged.
const LeftDivAny = LeftDiv as any;

interface TokenInfo {
  symbol: string;
  url: string;
  name: string;
  description: string;
}

interface TokenChooserListProps {
  tokenList?: TokenInfo[];
  chosenTokens?: { [symbol: string]: boolean };
  onTokenToggle?: (symbol: string, toggle: boolean) => void;
}

function TokenChooserList(props: TokenChooserListProps) {
  const { tokenList = [], chosenTokens = {}, onTokenToggle = () => undefined } = props;
  return (
    <LeftDivAny>
      <ListAny
        itemLayout="horizontal"
        dataSource={tokenList}
        renderItem={(item: TokenInfo) => (
          <ListItem actions={[<SwitchAny checked={chosenTokens[item.symbol]} onChange={(toggle: boolean) => onTokenToggle(item.symbol, toggle)} />]}>
            <ListItemMeta
              avatar={<TokenIcon tokenSymbol={item.symbol} size={32} />}
              title={<a href={item.url} target="_blank" rel="noopener">{item.name} ({item.symbol.toUpperCase()})</a>}
              description={item.description}
            />
          </ListItem>
        )}
      />
    </LeftDivAny>
  );
}

(TokenChooserList as any).propTypes = {
  tokenList: PropTypes.array,
  chosenTokens: PropTypes.object,
  onTokenToggle: PropTypes.func,
};

export default TokenChooserList;
