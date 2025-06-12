import { IAuthRepository } from '../interfaces/IAuthService';

export class AuthService {
  constructor(private authRepository: IAuthRepository) {}

  /**
   * Đăng nhập bằng authorization code + codeVerifier (PKCE)
   */
  async loginWithCode(code: string, codeVerifier: string) {
    const result = await this.authRepository.login(code, codeVerifier);
    return result; // { accessToken, refreshToken, idToken, expiresIn }
  }

  /**
   * Làm mới access token bằng refresh token
   */
  async refreshAccessToken(refreshToken: string) {
    return await this.authRepository.refreshToken(refreshToken);
  }

  /**
   * Thu hồi (revoke) token, đăng xuất
   */
  async logout(idToken: string) {
    await this.authRepository.logout(idToken);
  }
}
