import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { Encrypter } from '@/domain/forum/application/cryptography/encrypter';

@Injectable()
export class JwtEncrypter implements Encrypter {
  #jwtService: JwtService;

  constructor(readonly jwtService: JwtService) {
    this.#jwtService = jwtService;
  }

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.#jwtService.signAsync(payload);
  }
}
