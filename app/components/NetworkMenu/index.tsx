/**
*
* NetworkMenu
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Menu as AntdMenu, Button as AntdButton, Dropdown as AntdDropdown, Icon as AntdIcon } from 'antd';

// SAFETY: antd 3's bundled .d.ts files resolve 'react' to a hoisted
// @types/react@19 under pnpm (node_modules/.pnpm/node_modules), whose Component
// type lacks the `refs` member that @types/react@15's JSX.ElementClass requires.
// styled-components v2's bundled typings resolve 'react' the same way. The
// runtime components are unchanged; these aliases only re-type them for the
// app's React 15 JSX checking.
const Menu = AntdMenu as unknown as React.ComponentType<any>;
const Dropdown = AntdDropdown as unknown as React.ComponentType<any>;
const Icon = AntdIcon as unknown as React.ComponentType<any>;
// const SubMenu = AntdMenu.SubMenu;
// const MenuItemGroup = AntdMenu.ItemGroup;
const MenuItem = AntdMenu.Item;
// const MenuDivider = AntdMenu.Divider;

const StyledButton = styled(AntdButton)`
  margin: 15px;
` as unknown as React.ComponentType<any>;

const StyledMenuItem = styled(MenuItem)`
  line-height: 40px;
` as unknown as React.ComponentType<any>;

interface NetworkMenuProps {
  onLoadNetwork: (network: string) => void;
  networkName?: string;
  availableNetworks?: { map: (fn: (network: string) => any) => any };
}

function NetworkMenu(props: NetworkMenuProps) {
  const { networkName, availableNetworks, onLoadNetwork } = props;

  let options;
  if (availableNetworks) {
    options = availableNetworks.map((network) =>
      <StyledMenuItem key={network}><a tabIndex={0} role="button" onClick={() => onLoadNetwork(network)}>{network}</a></StyledMenuItem>
    );
  }

  const menu = (
    <Menu
      forceSubMenuRender
      defaultSelectedKeys={[networkName]}
      selectedKeys={[networkName]}
    >
      <StyledMenuItem disabled key="title">Select ETH network</StyledMenuItem>
      {options}
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <StyledButton size="large" icon="wifi">
        {networkName}<Icon type="down" />
      </StyledButton>
    </Dropdown>
  );
}

(NetworkMenu as any).propTypes = {
  onLoadNetwork: PropTypes.func.isRequired,
  networkName: PropTypes.string,
  availableNetworks: PropTypes.object,
};

export default NetworkMenu;
