/**
 * App — the skeleton around the actual pages (navigation is in Header).
 * Phase 6: react-router-dom v6 (Routes + element, replaces Switch/component).
 */
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';

export default function App(): React.ReactElement {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* original v4 config routed every unknown path to HomePage */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
}
