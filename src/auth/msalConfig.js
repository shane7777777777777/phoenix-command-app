/**
 * MSAL Configuration for Phoenix Command App
 * Uses the Phoenix Mail Courier app registration
 */
const AZURE_CLIENT_ID = import.meta.env.VITE_AZURE_CLIENT_ID;
const AZURE_TENANT_ID = import.meta.env.VITE_AZURE_TENANT_ID;
if (!AZURE_CLIENT_ID || !AZURE_TENANT_ID) {
  throw new Error(
    "Azure AD configuration missing: set VITE_AZURE_CLIENT_ID and VITE_AZURE_TENANT_ID "
    + "(copy .env.example to .env and fill in the Phoenix app registration values)"
  );
}
const API_SCOPE = import.meta.env.VITE_API_SCOPE || `api://${AZURE_CLIENT_ID}/.default`;

export const msalConfig = {
  auth: {
    // Phoenix Mail Courier app registration
    clientId: AZURE_CLIENT_ID,
    // Phoenix Electric Azure AD tenant
    authority: `https://login.microsoftonline.com/${AZURE_TENANT_ID}`,
    // Redirect URI - adjust for production
    redirectUri: window.location.origin,
    // Post logout redirect
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    // Store auth state in session storage (more secure for SPAs)
    cacheLocation: "sessionStorage",
    // Set to "true" if having issues on IE11 or Edge
    storeAuthStateInCookie: false,
  },
};

// Scopes for Microsoft Graph API access
export const loginRequest = {
  scopes: ["User.Read", "openid", "profile", "email"],
};

// Scopes for API calls (if needed for Azure Functions)
export const apiRequest = {
  scopes: [API_SCOPE],
};

// Graph API endpoints
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};

