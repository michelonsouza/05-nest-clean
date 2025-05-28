export abstract class HashComparer {
  abstract compare(plainText: string, hashedValue: string): Promise<boolean>;
}
