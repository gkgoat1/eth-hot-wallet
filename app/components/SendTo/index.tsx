/**
*
* SendTo
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Input, Icon } from 'antd';
// import styled from 'styled-components';

interface SendToProps {
  to?: string;
  onChangeTo?: (evt: any) => void;
  locked?: boolean;
}

// SAFETY: antd 3's bundled .d.ts files resolve 'react' to a hoisted
// @types/react@19 under pnpm, whose Component type fails the app's React 15
// JSX checker. The runtime components are unchanged; these aliases only
// re-type them.
const InputAny = Input as any;
const IconAny = Icon as any;

function SendTo({ to, onChangeTo, locked }: SendToProps) {
  return (
    <div>
      <InputAny
        style={{ width: '300px' }}
        placeholder="Send to address"
        prefix={<IconAny type="contacts" />}
        value={to}
        onChange={onChangeTo}
        disabled={locked}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
    </div>
  );
}

(SendTo as any).propTypes = {
  to: PropTypes.string,
  onChangeTo: PropTypes.func,
  locked: PropTypes.bool,
};

export default SendTo;
