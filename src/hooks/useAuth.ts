import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { loginRequest, apiRequest } from '../auth/msalConfig';

/**
 * useAuth — wraps MSAL React hooks with convenience methods.
 * Does NOT modify msalConfig, loginRequest, or apiRequest.
 */
export function useAuth() {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const account = accounts[0] ?? null;
  const userName = account?.name || account?.username || 'User';

  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.errorCode === 'popup_window_error') {
        await instance.loginRedirect(loginRequest);
      }
    }
  };

  const handleLogout = () => {
    instance.logoutPopup();
  };

  const getApiToken = async (): Promise<string> => {
    if (!account) {
      throw new Error('No authenticated account found');
    }

    try {
      const tokenResponse = await instance.acquireTokenSilent({
        ...apiRequest,
        account,
      });
      return tokenResponse.accessToken;
    } catch (error: any) {
      const needsInteraction =
        error instanceof InteractionRequiredAuthError ||
        error?.errorCode === 'interaction_required' ||
        error?.errorCode === 'consent_required';

      if (!needsInteraction) {
        throw error;
      }

      const tokenResponse = await instance.acquireTokenPopup({
        ...apiRequest,
        account,
      });
      return tokenResponse.accessToken;
    }
  };

  return {
    instance,
    accounts,
    account,
    inProgress,
    isAuthenticated,
    userName,
    handleLogin,
    handleLogout,
    getApiToken,
  };
}

