export type Result<T, E = Error> = Ok<T, E> | Err<T, E>;

export class Ok<T, E> {
  public constructor(public readonly value: T) {}

  public isOk(): this is Ok<T, E> {
    return true;
  }

  public isErr(): this is Err<T, E> {
    return false;
  }
}

export class Err<T, E> {
  public constructor(public readonly error: E) {}

  public isOk(): this is Ok<T, E> {
    return false;
  }

  public isErr(): this is Err<T, E> {
    return true;
  }
}

/**
 * Construct a new Ok result value.
 */
export function ok<T, E>(value: T): Ok<T, E> {
  return new Ok(value);
}

/**
 * Construct a new Err result value.
 */
export function err<T, E>(error: E): Err<T, E> {
  return new Err(error);
}
