export interface AuthRepository {
    login(code: string, codeVerifier: string): Promise<{accsessToken:string; refreshToken: string}>;
    refreshToken(refreshToken: string): Promise<string>;
    logout(idToken: string): Promise<void>;
}