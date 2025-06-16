
// ⚙️ Cấu hình IdentityServer4 endpoints (OpenID Connect discovery)
export const discovery = {
  authorizationEndpoint: 'http://localhost:5077/connect/authorize',
  tokenEndpoint: 'http://localhost:5077/connect/token',
  revocationEndpoint: 'http://localhost:5077/connect/revocation',
  endSessionEndpoint: 'http://localhost:5077/connect/endsession',
};

// 🆔 Client ID khai báo trong IdentityServer4 (phía server)
export const clientId = 'react_native_client';

// 🔗 Redirect URI (Expo hoặc custom scheme)
export const redirectUri = 'exp://192.168.0.101:8081';
//export const redirectUri = "http://auth.expo.dev/@luongluan/chat-app";
