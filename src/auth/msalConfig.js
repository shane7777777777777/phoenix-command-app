/**
 * MSAL Configuration for Phoenix Command App
 * Uses the Phoenix Mail Courier app registration
 */
const AZURE_CLIENT_ID = import.meta.env.VITE_AZURE_CLIENT_ID || "8b78f443-e000-4689-ad57-71e4e616960f";
const AZURE_TENANT_ID = import.meta.env.VITE_AZURE_TENANT_ID || "e7d8daef-fd5b-4e0b-bf8f-32f090c7c4d5";
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

