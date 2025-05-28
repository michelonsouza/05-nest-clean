// Left is a type that represents a failure or an error
export class Left<ReasonType, ValueType> {
  readonly value: ReasonType;

  constructor(reason: ReasonType) {
    this.value = reason;
  }

  isLeft(): this is Left<ReasonType, ValueType> {
    return true;
  }

  isRight(): this is Right<ReasonType, ValueType> {
    return false;
  }
}

// Right is a type that represents a success or a value
export class Right<ReasonType, ValueType> {
  readonly value: ValueType;

  constructor(value: ValueType) {
    this.value = value;
  }

  isLeft(): this is Left<ReasonType, ValueType> {
    return false;
  }

  isRight(): this is Right<ReasonType, ValueType> {
    return true;
  }
}

export type Either<LeftType, RightType> =
  | Left<LeftType, RightType>
  | Right<LeftType, RightType>;

export function left<ReasonType, ValueType>(
  reason: ReasonType,
): Either<ReasonType, ValueType> {
  return new Left<ReasonType, ValueType>(reason);
}

export function right<ReasonType, ValueType>(
  value: ValueType,
): Either<ReasonType, ValueType> {
  return new Right<ReasonType, ValueType>(value);
}
