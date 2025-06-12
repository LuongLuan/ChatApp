import * as AuthSession from 'expo-auth-session';
import { clientId, discovery, redirectUri } from '../../shared/constants/oauthConfig';

export async function exchangeCodeForToken(code: string, codeVerifier: string) {
  if (!discovery?.tokenEndpoint) throw new Error('Token endpoint not found in discovery.');

  const tokenResponse = await AuthSession.exchangeCodeAsync(
    {
      clientId,
      code,
      redirectUri,
      extraParams: {
        code_verifier: codeVerifier,
      },
    },
    discovery
  );

  return {
    accessToken: tokenResponse.accessToken,
    refreshToken: tokenResponse.refreshToken ?? '',
    idToken: tokenResponse.idToken ?? '',
    expiresIn: tokenResponse.expiresIn ?? 3600,
  };
}

export async function refreshAccessToken(refreshToken: string) {
  if (!discovery?.tokenEndpoint) throw new Error('Token endpoint not found in discovery.');

  const tokenResponse = await AuthSession.refreshAsync(
    {
      clientId,
      refreshToken,
    },
    discovery
  );

  return {
    accessToken: tokenResponse.accessToken ?? '',
    refreshToken: tokenResponse.refreshToken ?? refreshToken, // fallback dùng lại refreshToken cũ nếu không trả về mới
    idToken: tokenResponse.idToken ?? '',
    expiresIn: tokenResponse.expiresIn ?? 3600,
  };
}

export async function revokeToken(token: string) {
  if (!discovery?.revocationEndpoint) throw new Error('Revocation endpoint not found in discovery.');

  await AuthSession.revokeAsync(
    {
      token,
      clientId,
    },
    discovery
  );
}
