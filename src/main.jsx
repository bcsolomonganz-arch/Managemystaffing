import React from 'react';
import ReactDOM from 'react-dom/client';
import ManageMyStaffingApp from './App.jsx';
import { SecureErrorBoundary } from './lib/errorBoundary.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SecureErrorBoundary>
      <ManageMyStaffingApp />
    </SecureErrorBoundary>
  </React.StrictMode>
);
