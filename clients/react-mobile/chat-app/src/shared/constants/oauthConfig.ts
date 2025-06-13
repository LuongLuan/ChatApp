
// ⚙️ Cấu hình IdentityServer4 endpoints (OpenID Connect discovery)
export const discovery = {
  authorizationEndpoint: 'https://d710-118-69-35-26.ngrok-free.app/connect/authorize',
  tokenEndpoint: 'https://d710-118-69-35-26.ngrok-free.app/connect/token',
  revocationEndpoint: 'https://d710-118-69-35-26.ngrok-free.app/connect/revocation',
  endSessionEndpoint: 'https://d710-118-69-35-26.ngrok-free.app/connect/endsession',
};

// 🆔 Client ID khai báo trong IdentityServer4 (phía server)
export const clientId = 'react_native_client';

// 🔗 Redirect URI (Expo hoặc custom scheme)
export const redirectUri = 'exp://172.16.19.185:8081';
//export const redirectUri = "https://auth.expo.dev/@luongluan/chat-app";
