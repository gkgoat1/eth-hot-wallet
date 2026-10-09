/**
*
* SendProgress
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Spin } from 'antd';
import styled from 'styled-components';
import TxLink from 'components/TxLink';

// SAFETY: antd 3's bundled types resolve against @types/react 19 in this
// pnpm layout while app code resolves @types/react 15, so every antd class
// component fails JSX validation with spurious errors. At runtime these are
// ordinary React 15-compatible components; the casts only re-expose them to
// the React 15 JSX checker.
const AlertAny = Alert as any;
const SpinAny = Spin as any;

const Span = styled.span`
  overflow-wrap: break-word;
`;
// SAFETY: styled-components v2 has no bundled types; the installed
// @types/styled-components resolves against @types/react 19, so styled tags
// fail the React 15 JSX checker. Runtime behavior is unchanged.
const SpanAny = Span as any;

interface SendProgressProps {
  sendInProgress?: boolean;
  sendError?: boolean | string;
  sendTx?: boolean | string;
  txExplorer?: string;
}

function SendProgress({ sendInProgress, sendError, sendTx, txExplorer }: SendProgressProps) {
  if (sendInProgress) {
    return (
      <SpinAny
        spinning
        style={{ position: 'static' }}
        size="large"
        tip="Sending..."
      >
        <br /><br />
      </SpinAny>

    );
  }

  if (sendError !== false) {
    return (
      <AlertAny
        message="Send Error"
        description={sendError}
        type="error"
      />
    );
  }

  if (sendTx) {
    return (
      <AlertAny
        message="Send sucessfull"
        // SAFETY: `sendTx` is typed boolean|string; the truthy guard above
        // narrows out false, and in practice the reducer only ever stores a
        // tx hash string here. The cast keeps the exact runtime value.
        description={<SpanAny> TX: <br /> <TxLink tx={sendTx as string} explorer={txExplorer} /> </SpanAny>}
        type="success"
      />
    );
  }

  return null;
}

(SendProgress as any).propTypes = {
  sendInProgress: PropTypes.oneOfType([PropTypes.bool]),
  sendError: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  sendTx: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  txExplorer: PropTypes.string,
};

export default SendProgress;
