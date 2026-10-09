/*
 *
 * LanguageProvider
 *
 * Connects the redux state language locale to the IntlProvider component and
 * i18n messages. i18n is disabled app-wide (IntlProvider commented out), so
 * this is a pass-through for children.
 */
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { makeSelectLocale } from './selectors';

interface LanguageProviderProps {
  children: React.ReactElement;
}

export class LanguageProvider extends React.PureComponent<LanguageProviderProps> {
  render() {
    return React.Children.only(this.props.children);
  }
}

const mapStateToProps = createSelector(makeSelectLocale(), (locale) => ({ locale }));

function mapDispatchToProps(dispatch: unknown) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageProvider);
