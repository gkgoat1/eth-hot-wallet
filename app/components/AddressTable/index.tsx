/**
*
* AddressTable
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Table as AntdTable } from 'antd';

import CurrencyDropdown from 'components/CurrencyDropdown';
import TokenIcon from 'components/TokenIcon';

// SAFETY: antd 3's bundled .d.ts files resolve 'react' to a hoisted
// @types/react@19 under pnpm (node_modules/.pnpm/node_modules), whose Component
// type lacks the `refs` member that @types/react@15's JSX.ElementClass requires.
// styled-components v2's bundled typings resolve 'react' the same way. The
// runtime components are unchanged; these aliases only re-type them for the
// app's React 15 JSX checking.
const { Column: AntdColumn } = AntdTable;
const Column = AntdColumn as unknown as React.ComponentType<any>;
// import { LocaleProvider } from 'antd';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

// plain JS object: number of decimals per token symbol
interface TokenDecimalsMap {
  [token: string]: number;
}

// plain JS object: per-token data ({ balance: BigNumber | false }) plus a numeric 'index' key
interface TokenMap {
  [token: string]: any;
}

// plain JS object: address -> TokenMap
interface AddressMap {
  [address: string]: TokenMap;
}

// plain JS object: exchange rates keyed by pair name (ie 'eth_usd')
interface ExchangeRates {
  [pair: string]: any;
}

interface AddressRow {
  index: number;
  key: number;
  token: string;
  address: string;
  balance: string;
  convert?: string;
}

const AddrTable = styled(AntdTable)`
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;
  tbody{
    background: white;
  }
  .ant-table{
    font-size: 13px !important;
  }
  th.columnCenter,
  td.columnCenter{
    text-align: center;
  }
` as unknown as React.ComponentType<any>;


/**
 * Create list of rows, one row per token for given address
 * @param  {object} tokenDecimalsMap
 * @param  {object} tokenMapIN
 * @param  {string} address current address
 * @param  {number} startKey the first key of the given address
 *
 * @return {object[]} array as rows, one row per token/address
 * row:
{
  key: '1',
  index: '1',
  token: 'eth',
  address: '13c...9d06',
  balance: '3',
  convert: '',
} */
const splitAddrToRows = (tokenDecimalsMap: TokenDecimalsMap, tokenMapIN: TokenMap, address: string, startKey: number): AddressRow[] => {
  let key = startKey;
  const tokenMap = tokenMapIN;
  const index = tokenMap.index;
  delete tokenMap.index;

  return Object.keys(tokenMap).map((token) => {
    const sameAddressRow = {} as AddressRow;
    sameAddressRow.index = index;
    sameAddressRow.key = key;
    key += 1;
    sameAddressRow.token = token;
    sameAddressRow.address = address;
    const balance = tokenMap[token].balance;
    const decimals = tokenDecimalsMap[token];
    sameAddressRow.balance = balance ? balance.div((10 ** decimals).toString()).toString(10) : 'n/a';
    // sameAddressRow.convert = '';
    return sameAddressRow;
  });
};

/**
 * Transforms addressMap into Array of rows
 * @param  {object} addressMap
 * @param  {object} tokenDecimalsMap number of decimal for each currency
 * @param  {boolean} showTokens should show token in the table
 * return example: addressArray =
  [{{
    key: '1',
    index: '1',
    token: 'eth',
    address: '13c...9d06',
    balance: '3',
    convert: '200 USD',
  },
    key: '2',
    index: '1',
    token: 'eos',
    address: '13c...9d06',
    balance: '3',
    convert: '15 USD',
  }, {
    key: '3',
    index: '1',
    token: 'ppt',
    address: '13c...9d06',
    balance: '3',
    convert: '13 USD',
  },
] */
const transformList = (addressMap: AddressMap, tokenDecimalsMap: TokenDecimalsMap, showTokens: boolean): AddressRow[] => { //eslint-disable-line
  // const showTokens = true;
  let iKey = 1;
  const list = Object.keys(addressMap).map((address) => {
    const tokenMap = addressMap[address];
    const sameAddressList = splitAddrToRows(tokenDecimalsMap, tokenMap, address, iKey);

    iKey += sameAddressList.length;
    return sameAddressList;
  });
  return ([] as AddressRow[]).concat(...list); // flaten array
};

/**
 * return conversion rate from given token
 * @param  {object} exchangeRates available exchange rates
 * @param  {string} from symbol to convert from: 'eth' / 'usd' / ..
 * @param  {string} to the convertion pair to use: ie "eth_usd"
 *
 * @return {Array} array as data for table, see example above
 */
const getConvertRate = (exchangeRates: ExchangeRates, from: string, to: string) => {
  const fromKey = `eth_${from}`;
  // convert token to eth by invert(eth_token)
  const toEthRate = exchangeRates[fromKey].rate.toPower(-1);
  const toTokenRate = exchangeRates[to].rate;
  return toEthRate && toTokenRate && toEthRate.times(toTokenRate);
};

/**
 * Add converted rates to all rows
 * adds nothing if exchange rate not found
 * @param  {object[]} rowList table rows contains balance
 * @param  {object} exchangeRates all available exchange rates
 * @param  {string} convertTo the convertion pair to use: ie "eth_usd"
 *
 * @return {Array} array as data for table, see example above
 */
const addConvertRates = (rowList: AddressRow[], exchangeRates: ExchangeRates, convertTo: string): AddressRow[] =>
  rowList.map((row) => {
    try {
      // const convertToSymbol = convertTo.slice(4).toUpperCase();
      if (`eth_${row.token}` === convertTo) {
        row.convert = row.balance; // eslint-disable-line
      } else {
        const convertRate = getConvertRate(exchangeRates, row.token, convertTo);
        row.convert = convertRate.times(row.balance).round(5).toString(10); // eslint-disable-line
      }
      return row;
    } catch (err) {
      // no rates found
      return row;
    }
  });

interface AddressTableProps {
  addressMap?: AddressMap | boolean;
  tokenDecimalsMap?: TokenDecimalsMap | boolean;
  onShowSendToken: (address: string, token: string) => void;
  exchangeRates?: ExchangeRates;
  onSelectCurrency: (convertTo: string) => void;
  convertTo?: string | boolean;
}

function AddressTable(props: AddressTableProps) {
  const {
    addressMap,
    tokenDecimalsMap,
    onShowSendToken,
    exchangeRates,
    onSelectCurrency,
    convertTo,
  } = props;

  // SAFETY: AddressTable only renders once a fiat pair is selected, so
  // convertTo is always its string form here (never false/undefined).
  const currencyDropdownProps = { exchangeRates, onSelectCurrency, convertTo: convertTo as string };

  // SAFETY: callers only render AddressTable once an address list exists,
  // so addressMap / tokenDecimalsMap / exchangeRates / convertTo are their object forms here (never false)
  const rowList = transformList(addressMap as AddressMap, tokenDecimalsMap as TokenDecimalsMap, true);
  const completeRowList = addConvertRates(rowList, exchangeRates as ExchangeRates, convertTo as string);

  return (
    <AddrTable
      dataSource={completeRowList}
      bordered
      scroll={{ x: 860 }}
      pagination={false}
      locale={{
        filterTitle: null,
        filterConfirm: 'Ok',
        filterReset: 'Reset',
        emptyText: 'No Data',
      }}

    >
      <Column
        title="Address"
        dataIndex="address"
        key="address"
        width="250px"
        className="columnCenter"
        colSpan="1"
        rowSpan="3"
        render={(text: any, record: AddressRow) => {
          const obj = {
            children: text,
            props: {} as { rowSpan?: number },
          };
          if (record.token !== 'eth') {
            // obj.props.rowSpan = 0;
            obj.props.rowSpan = 0;
            // obj.children = '~';
          } else {
            // SAFETY: callers only render AddressTable once an address list exists,
            // so tokenDecimalsMap is its object form here (never false)
            obj.props.rowSpan = Object.keys(tokenDecimalsMap as TokenDecimalsMap).length || 2;
          }
          return obj;
        }}
      />
      {/* <Column
        title="#"
        dataIndex="key"
        key="key"
        width="10px"
        sorter={(a, b) => parseInt(a.key, 10) - parseInt(b.key, 10)}
        sortOrder="ascend"
        className="columnCenter"
      /> */}
      <Column
        title="Icon"
        key="Icon"
        width="50px"
        render={(text: any, record: AddressRow) => (
          <TokenIcon tokenSymbol={record.token} />
        )}
        className="columnCenter"
      />

      <Column
        title="Token"
        dataIndex="token"
        key="token"
        width="65px"
        className="columnCenter"
        render={(text: any, record: AddressRow) => (
          record.token.toUpperCase()
        )}
      />
      <Column
        title="Balance"
        dataIndex="balance"
        key="balance"
        width="80px"
        filters={[{
          text: 'Remove empty',
          value: '0 ETH',
        }]}
        onFilter={(value: any, record: AddressRow) => record.balance !== value}
      />
      <Column
        title={<CurrencyDropdown {...currencyDropdownProps} />}
        dataIndex="convert"
        key="convert"
        width="80px"
      />
      <Column
        width="65px"
        title="Action"
        key="action"
        render={(text: any, record: AddressRow) => (
          <span>
            {/* <a href="#" >Show QR</a>
            <span className="ant-divider" /> */}
            {/* eslint-disable */}
            <a onClick={() => onShowSendToken(record.address, record.token)}>Send</a>
            {/* eslint-enable */}
          </span>
        )}
      />
    </AddrTable >
  );
}

(AddressTable as any).propTypes = {
  addressMap: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  tokenDecimalsMap: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  onShowSendToken: PropTypes.func,
  exchangeRates: PropTypes.object,
  onSelectCurrency: PropTypes.func,
  convertTo: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export default AddressTable;
