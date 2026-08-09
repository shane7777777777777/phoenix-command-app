import assert from 'node:assert/strict';
import test from 'node:test';

import { requireProductionAzureConfig } from '../build/azure-env.js';

const VALID = {
  VITE_AZURE_CLIENT_ID: '11111111-2222-3333-4444-555555555555',
  VITE_AZURE_TENANT_ID: '66666666-7777-8888-9999-aaaaaaaaaaaa'
};

test('production Azure config requires a GUID client ID', () => {
  assert.throws(
    () => requireProductionAzureConfig({}),
    /VITE_AZURE_CLIENT_ID must be set/
  );
  assert.throws(
    () => requireProductionAzureConfig({ ...VALID, VITE_AZURE_CLIENT_ID: 'not-a-guid' }),
    /VITE_AZURE_CLIENT_ID must be set/
  );
});

test('production Azure config requires a tenant', () => {
  assert.throws(
    () => requireProductionAzureConfig({ ...VALID, VITE_AZURE_TENANT_ID: '  ' }),
    /VITE_AZURE_TENANT_ID must be set/
  );
});

test('valid Azure config is returned trimmed', () => {
  assert.deepEqual(
    requireProductionAzureConfig({
      VITE_AZURE_CLIENT_ID: ` ${VALID.VITE_AZURE_CLIENT_ID} `,
      VITE_AZURE_TENANT_ID: ' phoenixelectric.onmicrosoft.com '
    }),
    {
      clientId: VALID.VITE_AZURE_CLIENT_ID,
      tenantId: 'phoenixelectric.onmicrosoft.com'
    }
  );
});
