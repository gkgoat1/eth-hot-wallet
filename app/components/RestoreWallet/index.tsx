/**
*
* RestoreWallet
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

interface RestoreWalletProps {
  isShowRestoreWallet?: boolean;
  userSeed?: string;
  onChangeUserSeed?: (evt: any) => void;
  onRestoreWalletFromSeed?: (evt: any) => void;
}

function RestoreWallet({ isShowRestoreWallet, userSeed, onChangeUserSeed, onRestoreWalletFromSeed }: RestoreWalletProps) {
  // console.log(isShowRestoreWallet);
  // onSubmit={props.onSubmitForm}
  /*
  <textarea
   placeholder="Enter seed"
   onChange={onChangeUserSeed}
   />
  */
  if (isShowRestoreWallet) {
    return (
      <div>
        <br />
        <form > { /* todo: cancel default action */}
          <label htmlFor="restoreWalletBox">
            <input
              id="restoreWalletBox"
              type="text"
              placeholder="Enter seed"
              value={userSeed}
              onInput={onChangeUserSeed}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </label>
          <br />
          <button onClick={onRestoreWalletFromSeed}>
            Restore from seed
          </button>
        </form>
      </div>
    );
  }
  return null;
}

(RestoreWallet as any).propTypes = {
  isShowRestoreWallet: PropTypes.bool,
  userSeed: PropTypes.string,
  onChangeUserSeed: PropTypes.func,
  onRestoreWalletFromSeed: PropTypes.func,
};

export default RestoreWallet;
