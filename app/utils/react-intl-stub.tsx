/**
 * Minimal local stand-in for react-intl.
 *
 * The original app lists react-intl usage all over (defineMessages in
 * messages.ts files, one FormattedMessage import), but i18n is disabled
 * app-wide (LanguageProvider is commented out of app.jsx) and react-intl was
 * never in package.json — it only ever "worked" because webpack resolved it
 * loosely. i18n stays out of scope (plan §7: "react-intl is present but mostly
 * disabled; do not re-introduce during migration"), so this stub preserves the
 * exact behavior the app actually relied on:
 *
 * - defineMessages: identity — returns the descriptor map unchanged.
 * - FormattedMessage: renders the defaultMessage (or id) as a span.
 */
import React from 'react';

export interface MessageDescriptor {
  id: string;
  defaultMessage?: string;
  description?: string;
}

export function defineMessages<T extends Record<string, MessageDescriptor>>(messages: T): T {
  return messages;
}

export function FormattedMessage(props: MessageDescriptor) {
  return <span>{props.defaultMessage ?? props.id}</span>;
}

export default { defineMessages, FormattedMessage };
