import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Env } from './env';

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  get<Key extends keyof Env>(key: Key): Env[Key] {
    const value = this.configService.get(key, { infer: true });

    if (value === undefined) {
      throw new Error(`Environment variable ${key} is not defined`);
    }

    return value;
  }
}
