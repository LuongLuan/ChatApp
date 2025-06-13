import { IAuthService } from "../interfaces/IAuthService";

export class LoginWithIdentityServer {
  constructor(private authRepo: IAuthService) {}

  async execute(code: string, codeVerifier: string) {
    return await this.authRepo.login(code, codeVerifier);
  }
}
