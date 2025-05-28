import { Either, left, right } from './either';

function doSomething(shouldSucess: boolean): Either<string, number> {
  return shouldSucess ? right(1) : left('error');
}

describe('Either: functional error handling', () => {
  it('success result', () => {
    const successResult = doSomething(true);

    expect(successResult.isRight()).toBe(true);
    expect(successResult.isLeft()).toBe(false);
  });

  it('error result', () => {
    const errorResult = doSomething(false);

    expect(errorResult.isLeft()).toBe(true);
    expect(errorResult.isRight()).toBe(false);
  });
});
