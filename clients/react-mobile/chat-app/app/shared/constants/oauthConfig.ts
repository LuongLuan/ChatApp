import * as AuthSession from 'expo-auth-session';

// ⚙️ Cấu hình IdentityServer4 endpoints (OpenID Connect discovery)
export const discovery = {
  authorizationEndpoint: 'https://your-identityserver-domain/connect/authorize',
  tokenEndpoint: 'https://your-identityserver-domain/connect/token',
  revocationEndpoint: 'https://your-identityserver-domain/connect/revocation',
  endSessionEndpoint: 'https://your-identityserver-domain/connect/endsession',
};

// 🆔 Client ID khai báo trong IdentityServer4 (phía server)
export const clientId = 'react_native_client';

// 🔗 Redirect URI (Expo hoặc custom scheme)
export const redirectUri = AuthSession.makeRedirectUri({
  scheme:'chatapp'
});
