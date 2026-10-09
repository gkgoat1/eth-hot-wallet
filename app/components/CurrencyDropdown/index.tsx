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

// SAFETY: antd 3's bundled .d.ts files resolve 'react' to a hoisted
// @types/react@19 under pnpm, whose Component type fails the app's React 15
// JSX checker. The runtime components are unchanged; these aliases only
// re-type them.
const MenuAny = Menu as any;
const MenuItemAny = MenuItem as any;
const DropdownAny = Dropdown as any;
const IconAny = Icon as any;

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
      convertMenuOptions.push(<MenuItemAny key={currency}>{exchangeRates[currency].name}</MenuItemAny>);
    });
  }
  const convertToMenu = (
    <MenuAny onClick={(evt: { key: string }) => onSelectCurrency(evt.key)}>
      <MenuItemAny key={'none'}>None</MenuItemAny>
      {convertMenuOptions}
    </MenuAny>
  );

  return (
    <DropdownAny overlay={convertToMenu}>
      <span>
        {convertToSymbol === 'none' ? 'Convert' : `${convertToSymbol}`}<IconAny type="down" />
      </span>
    </DropdownAny>
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
