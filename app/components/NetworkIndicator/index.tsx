/**
*
* NetworkIndicator
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
import { Icon, Tooltip } from 'antd';

// import messages from './messages';
import { offlineModeString } from 'utils/constants';

const Span = styled.span`
  font-size: 26px;
  min-width: 30px;
`;

// SAFETY: antd 3 / styled-components v2 typings resolve 'react' to a hoisted
// @types/react@19 under pnpm, whose Component type fails the app's React 15
// JSX checker. The runtime components are unchanged; these aliases only
// re-type them.
const SpanAny = Span as any;
const IconAny = Icon as any;
const TooltipAny = Tooltip as any;

interface NetworkIndicatorProps {
  loading?: boolean;
  error?: object | string | boolean;
}

function NetworkIndicator(props: NetworkIndicatorProps) {
  const { loading, error } = props;
  let component = null;
  if (loading) {
    component = <IconAny type="loading" />;
  }
  if (error && error !== offlineModeString) {
    // SAFETY: antd 3's `title` is typed against @types/react@19's ReactNode;
    // at runtime error here is a renderable error string (truthy and not the
    // offline sentinel), so the alias only re-types it.
    const errorTitle = error as any;
    component =
      (<TooltipAny placement="bottom" title={errorTitle}>
        <IconAny type="close-circle-o" style={{ color: 'red' }} />
      </TooltipAny>);
  }

  return (
    <SpanAny>
      {component}
    </SpanAny>
  );
}

(NetworkIndicator as any).propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
  ]),
};

export default NetworkIndicator;
