import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { exchangeCodeForToken, refreshAccessToken, revokeToken } from '../api/IdentityServerApi';

export class AuthRepositoryImpl implements AuthRepository {
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
