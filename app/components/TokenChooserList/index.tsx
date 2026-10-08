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
const ListItem = List.Item;
const ListItemMeta = List.Item.Meta;
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
  const { tokenList, chosenTokens, onTokenToggle } = props;
  return (
    <LeftDiv>
      <List
        itemLayout="horizontal"
        dataSource={tokenList}
        renderItem={(item) => (
          <ListItem actions={[<Switch checked={chosenTokens[item.symbol]} onChange={(toggle) => onTokenToggle(item.symbol, toggle)} />]}>
            <ListItemMeta
              avatar={<TokenIcon tokenSymbol={item.symbol} size={32} />}
              title={<a href={item.url} target="_blank" rel="noopener">{item.name} ({item.symbol.toUpperCase()})</a>}
              description={item.description}
            />
          </ListItem>
        )}
      />
    </LeftDiv>
  );
}

(TokenChooserList as any).propTypes = {
  tokenList: PropTypes.array,
  chosenTokens: PropTypes.object,
  onTokenToggle: PropTypes.func,
};

export default TokenChooserList;
