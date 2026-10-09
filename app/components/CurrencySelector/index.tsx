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
  exchangeRates?: Record<string, { name?: string }>; // plain object: pair -> rate info
  onSelectCurrency: (currency: string) => void;
}

function CurrencySelector({ convertTo, exchangeRates, onSelectCurrency }: CurrencySelectorProps) {
  // SAFETY: `false` is the runtime "no currency selected" sentinel for the
  // native <select>/<option> value (React 15 drops a false value attribute,
  // leaving the first option selected). The React 15 DOM typings only admit
  // string | number | string[], so this cast re-exposes the runtime value
  // without changing it.
  const noSelectionValue = false as unknown as string;
  const options: JSX.Element[] = [];
  // exchangeRates is a plain object; Object.entries preserves insertion order,
  // matching the old Immutable entrySeq() order.
  if (exchangeRates && Object.keys(exchangeRates).length > 0) {
    Object.entries(exchangeRates).forEach(([pair, rateInfo]) => {
      // console.log(`key: ${pair}, value: ${rateInfo}`);
      options.push(<option value={pair} key={pair}>{rateInfo.name}</option>);
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
          // SAFETY: `convertTo` may be the `false` sentinel; see
          // noSelectionValue above. The narrowing cast does not change the
          // runtime value passed to the DOM.
          value={convertTo as string | undefined}
          onChange={(evt: { target: { value: string } }) => onSelectCurrency(evt.target.value)}
          disabled={false}
        >
          <option value={noSelectionValue}>{'select'} </option>
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
