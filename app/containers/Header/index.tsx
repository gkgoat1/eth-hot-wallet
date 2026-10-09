/**
 *
 * Header
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// @ts-ignore react-redux 5 has no bundled typings; connect is used untyped (React 15 legacy).
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Row as AntdRow, Col as AntdCol } from 'antd';


import NetworkIndicator from 'components/NetworkIndicator';
import Logo from 'components/Logo';
import NetworkMenu from 'components/NetworkMenu';

// import { changeBalance } from 'containers/HomePage/actions';

import {
  makeSelectNetworkReady,
  makeSelectLoading,
  makeSelectError,
  makeSelectNetworkName,
  makeSelectBlockNumber,
  makeSelectAvailableNetworks,
  /* makeSelectCheckingBalanceDoneTime,
  makeSelectCheckingBalances,
  makeSelectCheckingBalancesError, */
  makeSelectCheckFaucetLoading,
  makeSelectCheckFaucetSuccess,
  makeSelectAskFaucetLoading,
  makeSelectAskFaucetSuccess,
  makeSelectAskFaucetError,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';
import { loadNetwork } from './actions';

// SAFETY: antd 3's and styled-components v2's bundled .d.ts files resolve
// 'react' to a hoisted @types/react@19 under pnpm, whose Component type lacks
// the `refs` member that @types/react@15's JSX.ElementClass requires. Runtime
// components are unchanged; these aliases only re-type them for the app's
// React 15 JSX checking (same convention as components/NetworkMenu).
const Row = AntdRow as unknown as React.ComponentType<any>;
const Col = AntdCol as unknown as React.ComponentType<any>;

const HeaderWrapped = styled.header`
  transition: opacity 0.5s;
  margin-bottom: 30px;
  padding: 0;
  width: 100%;
  font-size: 16px;
` as unknown as React.ComponentType<any>;

interface HeaderProps {
  onLoadNetwork: (name: string) => void;
  // onCheckBalances: PropTypes.func.isRequired,

  loading?: boolean;
  error?: object | string | boolean;
  networkName?: string;
  // fromJS(Object.keys(Network)) -> Immutable.List<string> at runtime; the
  // structural `map` matches NetworkMenu's own props contract.
  availableNetworks?: { map: (fn: (network: string) => any) => any }; // eslint-disable-line @typescript-eslint/no-explicit-any
  blockNumber?: number;

  /* checkingBalanceDoneTime: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  checkingBalances: PropTypes.bool,
  checkingBalancesError: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]), */
}

function Header(props: HeaderProps) {
  const {
    loading,
    error,
    networkName,
    blockNumber,
    availableNetworks,
    onLoadNetwork,
   } = props;

  const networkIndicatorProps = {
    loading,
    error,
    blockNumber,
  };

  const networkMenuProps = {
    availableNetworks,
    networkName,
    onLoadNetwork,
  };

  return (
    <HeaderWrapped className="clearfix">
      <Row type="flex" align="middle" justify="space-between" style={{ backgroundColor: '#fff' }}>
        <Col sm={{ span: 6, offset: 1 }} xs={24}>
          <Logo />
        </Col>
        <Col sm={{ span: 8, offset: 2 }} xs={24}>
          <Row type="flex" align="middle" justify="center">
            <NetworkIndicator {...networkIndicatorProps} />
            <NetworkMenu {...networkMenuProps} />
          </Row>
        </Col>
      </Row >
    </HeaderWrapped >
  );
}

Header.propTypes = {
  onLoadNetwork: PropTypes.func.isRequired,
  // onCheckBalances: PropTypes.func.isRequired,

  loading: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
  ]),
  networkName: PropTypes.string,
  availableNetworks: PropTypes.object,
  blockNumber: PropTypes.number,

  /* checkingBalanceDoneTime: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  checkingBalances: PropTypes.bool,
  checkingBalancesError: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]), */
};

// SAFETY: createStructuredSelector's reselect 3 typings infer the store state
// as `unknown` while the selectors key off ImmutableState; the app state is an
// Immutable.Map, so the cast only re-aligns the inferred state parameter.
const mapStateToProps = createStructuredSelector({
  networkReady: makeSelectNetworkReady(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  networkName: makeSelectNetworkName(),
  availableNetworks: makeSelectAvailableNetworks(),
  blockNumber: makeSelectBlockNumber(),
  /* checkingBalanceDoneTime: makeSelectCheckingBalanceDoneTime(),
  checkingBalances: makeSelectCheckingBalances(),
  checkingBalancesError: makeSelectCheckingBalancesError(), */
  checkFaucetLoading: makeSelectCheckFaucetLoading(),
  checkFaucetSuccess: makeSelectCheckFaucetSuccess(),
  askFaucetLoading: makeSelectAskFaucetLoading(),
  askFaucetSuccess: makeSelectAskFaucetSuccess(),
  askFaucetError: makeSelectAskFaucetError(),
} as any) as (state: unknown) => Record<string, unknown>;

function mapDispatchToProps(dispatch: (action: { type: string }) => void) {
  return {
    onLoadNetwork: (name: string) => {
      // if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadNetwork(name));
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

// SAFETY: the reducer keys its action by a concrete union while injectReducer
// accepts (state: unknown, action: unknown); redux dispatches are dynamically
// typed at runtime, so the cast only widens the parameter types.
const withReducer = injectReducer({ key: 'header', reducer: reducer as (state: unknown, action: unknown) => unknown });
const withSaga = injectSaga({ key: 'header', saga });

// SAFETY: redux 3 `compose` typings don't track these higher-order component
// signatures (react-redux is untyped); the runtime composition is unchanged.
const enhanced = (compose(
  withReducer,
  withSaga,
  withConnect,
) as (component: React.ComponentType<any>) => React.ComponentType<any>)(Header);

export default enhanced;
