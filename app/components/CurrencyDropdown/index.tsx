/**
*
* CurrencyDropdown
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Icon } from 'antd';
// import styled from 'styled-components';
const MenuItem = Menu.Item;

// plain JS object: exchange rates keyed by currency pair (ie 'eth_usd')
interface ExchangeRates {
  [pair: string]: any;
}

interface CurrencyDropdownProps {
  convertTo: string;
  exchangeRates?: ExchangeRates;
  onSelectCurrency: (currency: string) => void;
}

function CurrencyDropdown(props: CurrencyDropdownProps) {
  const { exchangeRates, onSelectCurrency, convertTo } = props;

  const convertToSymbol = convertTo.length > 4 ? convertTo.slice(4).toUpperCase() : 'none';

  const convertMenuOptions: JSX.Element[] = [];
  if (exchangeRates) {
    Object.keys(exchangeRates).forEach((currency) => {
      convertMenuOptions.push(<MenuItem key={currency}>{exchangeRates[currency].name}</MenuItem>);
    });
  }
  const convertToMenu = (
    <Menu onClick={(evt: { key: string }) => onSelectCurrency(evt.key)}>
      <MenuItem key={'none'}>None</MenuItem>
      {convertMenuOptions}
    </Menu>
  );

  return (
    <Dropdown overlay={convertToMenu}>
      <span>
        {convertToSymbol === 'none' ? 'Convert' : `${convertToSymbol}`}<Icon type="down" />
      </span>
    </Dropdown>
  );
}

// SAFETY: propTypes is a React runtime field; without @types/react the plain
// function type has no such property, so the cast only re-exposes it.
(CurrencyDropdown as any).propTypes = {
  convertTo: PropTypes.string,
  exchangeRates: PropTypes.object,
  onSelectCurrency: PropTypes.func,
};

export default CurrencyDropdown;
