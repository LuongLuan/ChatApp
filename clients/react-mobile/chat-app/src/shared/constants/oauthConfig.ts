
// ⚙️ Cấu hình IdentityServer4 endpoints (OpenID Connect discovery)
export const discovery = {
  authorizationEndpoint: 'https://32c5-118-69-35-26.ngrok-free.app/connect/authorize',
  tokenEndpoint: 'https://32c5-118-69-35-26.ngrok-free.app/connect/token',
  revocationEndpoint: 'https://32c5-118-69-35-26.ngrok-free.app/connect/revocation',
  endSessionEndpoint: 'https://32c5-118-69-35-26.ngrok-free.app/connect/endsession',
};

// 🆔 Client ID khai báo trong IdentityServer4 (phía server)
export const clientId = 'react_native_client';

// 🔗 Redirect URI (Expo hoặc custom scheme)
export const redirectUri = 'exp://172.16.19.185:8081';
//export const redirectUri = "http://auth.expo.dev/@luongluan/chat-app";
