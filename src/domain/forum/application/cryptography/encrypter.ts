export abstract class Encrypter<
  PayloadType extends Record<string, unknown> = Record<string, unknown>,
> {
  abstract encrypt(payload: PayloadType): Promise<string>;
}
