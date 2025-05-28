import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';

const hashConcatenation = '-hashed';

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plainText: string): Promise<string> {
    return Promise.resolve(plainText.concat(hashConcatenation));
  }

  async compare(plainText: string, hashedValue: string): Promise<boolean> {
    return Promise.resolve(plainText.concat(hashConcatenation) === hashedValue);
  }
}
