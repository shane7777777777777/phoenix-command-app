const GUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Production builds must carry real Azure AD configuration. The source no
 * longer ships fallback identifiers, so a build missing these env vars would
 * otherwise only fail at runtime in the user's browser.
 *
 * The client ID is always an app-registration GUID. The tenant may be a GUID
 * or a domain form accepted by the authority URL (e.g. contoso.onmicrosoft.com).
 */
export function requireProductionAzureConfig(env) {
  const clientId = String(env.VITE_AZURE_CLIENT_ID || '').trim();
  const tenantId = String(env.VITE_AZURE_TENANT_ID || '').trim();

  if (!GUID_PATTERN.test(clientId)) {
    throw new Error(
      'VITE_AZURE_CLIENT_ID must be set to the Azure app registration GUID for production builds'
    );
  }
  if (!tenantId) {
    throw new Error(
      'VITE_AZURE_TENANT_ID must be set to the Azure tenant for production builds'
    );
  }

  return { clientId, tenantId };
}
