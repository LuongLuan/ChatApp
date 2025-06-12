import { AuthRepository } from "../../domain/repositories/AuthRepository";

export class LoginWithIdentityServer {
  constructor(private authRepo: AuthRepository) {}

  async execute(code: string, codeVerifier: string) {
    return await this.authRepo.login(code, codeVerifier);
  }
}
