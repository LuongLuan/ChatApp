import { AuthRepository } from "../interfaces/IAuthService";

export class LoginWithIdentityServer {
  constructor(private authRepo: AuthRepository) {}

  async execute(code: string, codeVerifier: string) {
    return await this.authRepo.login(code, codeVerifier);
  }
}
