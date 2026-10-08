/**
*
* CurrencySelector
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

interface CurrencySelectorProps {
  convertTo?: string | boolean;
  exchangeRates?: any; // immutable Map of pair -> rate info
  onSelectCurrency: (currency: string) => void;
}

function CurrencySelector({ convertTo, exchangeRates, onSelectCurrency }: CurrencySelectorProps) {
  const options: JSX.Element[] = [];
  if (exchangeRates.size > 0) {
    exchangeRates.entrySeq().forEach((entry: [string, any]) => {
      // console.log(`key: ${entry[0]}, value: ${entry[1]}`);
      options.push(<option value={entry[0]} key={entry[0]}>{entry[1].get('name')}</option>);
    });
  }
  /* if (availableNetworks) {
    options = availableNetworks.map((network) =>
      <option value={network} key={network}>{network} </option>
    );
  } */

  return (
    <div>
      <FormattedMessage {...messages.header} />
      <label htmlFor="currencySelectorDropdown">
        <select
          value={convertTo}
          onChange={(evt: { target: { value: string } }) => onSelectCurrency(evt.target.value)}
          disabled={false}
        >
          <option value={false}>{'select'} </option>
          {options}
        </select>
      </label>
    </div>
  );
}

// SAFETY: propTypes is a React runtime field; without @types/react the plain
// function type has no such property, so the cast only re-exposes it.
(CurrencySelector as any).propTypes = {
  exchangeRates: PropTypes.object,
  onSelectCurrency: PropTypes.func,
  convertTo: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export default CurrencySelector;
