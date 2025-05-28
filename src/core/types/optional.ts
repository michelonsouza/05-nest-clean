/**
 * Make same property optional on type
 *
 * @example
 * ```typescript
 * interface Post {
 *  id: string;
 *  name: string;
 *  email: string;
 * }
 *
 * Optional<Post, 'id' | 'email'>;
 *
 * ```
 */

export type Optional<DataType, Key extends keyof DataType> = Omit<
  DataType,
  Key
> &
  Partial<Pick<DataType, Key>>;
