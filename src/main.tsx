import React from 'react'
import ReactDOM from 'react-dom/client'
import { PublicClientApplication, EventType } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from './auth/msalConfig'
import PhoenixCommandApp from './App'
import './index.css'

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Handle redirect promise on page load
msalInstance.initialize().then(() => {
  // Account selection logic
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  // Add event callback for login
  msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && (event.payload as any)?.account) {
      msalInstance.setActiveAccount((event.payload as any).account);
    }
  });

  // Render the app
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <MsalProvider instance={msalInstance}>
        <PhoenixCommandApp />
      </MsalProvider>
    </React.StrictMode>,
  );
}).catch((error) => {
  console.error('[MSAL] Initialization failed:', error);
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <MsalProvider instance={msalInstance}>
        <PhoenixCommandApp />
      </MsalProvider>
    </React.StrictMode>,
  );
});

