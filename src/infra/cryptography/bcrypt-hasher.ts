import { hash, compare } from 'bcryptjs';

import type { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer';
import type { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';

export class BcryptHasher implements HashGenerator, HashComparer {
  #HASH_SALT_ROUNDS = 8;

  async hash(value: string): Promise<string> {
    return hash(value, this.#HASH_SALT_ROUNDS);
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    return compare(value, hashedValue);
  }
}
