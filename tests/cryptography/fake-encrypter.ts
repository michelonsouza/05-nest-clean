import { Encrypter } from '@/domain/forum/application/cryptography/encrypter';

export class FakeEncrypter extends Encrypter {
  encrypt(payload: Record<string, unknown>): Promise<string> {
    return Promise.resolve(JSON.stringify(payload));
  }
}
