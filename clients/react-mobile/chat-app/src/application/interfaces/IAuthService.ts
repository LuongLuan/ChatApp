export interface IAuthService {
    login(code: string, codeVerifier: string): Promise<{accessToken:string; refreshToken: string, idToken:string, expiresIn: number}>;
    refreshToken(refreshToken: string): Promise<string>;
    logout(idToken: string): Promise<void>;
}