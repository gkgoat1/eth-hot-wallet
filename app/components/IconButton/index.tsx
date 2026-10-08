/**
*
* IconButton
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popconfirm, Tooltip } from 'antd';
import styled from 'styled-components';

const ErrorSpan = styled.span`
  .anticon {
    color: red;
  }
  .ant-btn{
    color: red;
  }
  `;

interface BtnProps {
  error?: object | string | boolean;
  popconfirm?: boolean;
  text: string;
  loading?: boolean;
  disabled?: boolean;
  popconfirmMsg?: object | string | boolean;
  onClick?: () => void;
  icon: string;
  [key: string]: any; // rest props forwarded to antd Button
}

const Btn = ({ error, popconfirm, text, loading, disabled, popconfirmMsg, onClick, icon, ...btnProps }: BtnProps) => (
  <Button
    icon={icon}
    type="default"
    size="large"
    onClick={popconfirmMsg ? null : onClick}
    disabled={disabled}
    loading={loading}
    {...btnProps}
  >
    {text}
  </Button>
);
// SAFETY: propTypes is a React runtime field; without @types/react the plain
// function type has no such property, so the cast only re-exposes it.
(Btn as any).propTypes = {
  popconfirm: PropTypes.bool,
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,

  onClick: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]),
  disabled: PropTypes.bool,
  popconfirmMsg: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]),
};

const handlePopconfirm = (popConfirmText: object | string | boolean | undefined, onClick: (() => void) | undefined, component: JSX.Element) => {
  if (popConfirmText) {
    return (
      <Popconfirm placement="top" title={popConfirmText} onConfirm={onClick} okText="Confirm" cancelText="Abort">
        {component}
        <span />
      </Popconfirm>
    );
  }
  return (component);
};

interface IconButtonProps {
  text: string;
  icon: string;

  onClick?: () => void;
  loading?: boolean;
  error?: object | string | boolean;
  disabled?: boolean;
  popconfirmMsg?: object | string | boolean;

  [key: string]: any; // rest props forwarded to antd Button
}

function IconButton(props: IconButtonProps) {
  const { text, icon, onClick, loading, error, disabled, popconfirmMsg, ...btnProps } = props;

  const handleError = (err: object | string | boolean | undefined, component: JSX.Element) => {
    if (err) {
      return (
        <Tooltip placement="bottom" title={`${err} - Click to retry`}>
          <ErrorSpan>
            {component}
          </ErrorSpan>
        </Tooltip>
      );
    }
    return (component);
  };

  const BtnProps = { text, icon, onClick, loading, error, disabled, popconfirmMsg, ...btnProps };
  return (
    handleError(error,
      handlePopconfirm(popconfirmMsg, onClick,
        <Btn
          {...BtnProps}

        />
      )
    )
  );
}

// SAFETY: propTypes is a React runtime field; without @types/react the plain
// function type has no such property, so the cast only re-exposes it.
(IconButton as any).propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,

  onClick: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]),
  disabled: PropTypes.bool,
  popconfirmMsg: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]),

};


export default IconButton;
