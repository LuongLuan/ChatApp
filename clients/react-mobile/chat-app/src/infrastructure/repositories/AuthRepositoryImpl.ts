import { IAuthService } from '../../application/interfaces/IAuthService';
import { exchangeCodeForToken, refreshAccessToken, revokeToken } from '../api/IdentityServerApi';

export class AuthRepositoryImpl implements IAuthService {
  async login(code: string, codeVerifier: string) {
    return await exchangeCodeForToken(code, codeVerifier);
  }

  async refreshToken(refreshTokenValue: string) {
    const refreshed = await refreshAccessToken(refreshTokenValue);
    return refreshed.accessToken;
  }

  async logout(idToken: string) {
    await revokeToken(idToken);
  }
}
