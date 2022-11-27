import { Context } from '@app/utils/context';
import BaseError from '@app/errors/base-error';
import is from 'is_js';

/**
 * Contains result which can be error or ok
 */
export default class Result<T> {
  private readonly value?: T;
  private readonly error?: Error;
  private readonly context?: Context;

  constructor({
    err: error,
    ok: value,
    ctx,
  }: {
    err?: string;
    ok?: T;
    ctx?: Context;
  }) {
    if (
      (is.existy(error) && is.existy(value)) ||
      (is.not.existy(error) && is.not.existy(value))
    ) {
      throw new BaseError(
        'Incorrect Result initialization',
        500,
        'result.INITIALIZE',
        {
          error,
          value,
        },
      );
    }
    if (error) {
      this.error = new Error(error);
    }

    if (value) {
      this.value = value;
    }

    this.context = ctx;
  }

  isErr(): boolean {
    return is.existy(this.error);
  }

  isOk(): boolean {
    return is.existy(this.value);
  }

  err(): Error {
    if (is.not.existy(this.error)) {
      throw new BaseError(
        'Cannot extract error when it is not present',
        500,
        'result.ERROR',
        {
          error: this.error,
          value: this.value,
        },
      );
    }
    return this.error;
  }

  ok(): T {
    if (is.not.existy(this.value)) {
      throw new BaseError(
        'Cannot extract ok when it is not present',
        500,
        'result.OK',
        {
          error: this.error,
          value: this.value,
        },
      );
    }
    return this.value;
  }

  ctx(): Context | undefined {
    return this.context;
  }

  static ok<T>(val: T, ctx?: Context): Result<T> {
    return new Result<T>({ ok: val, ctx });
  }

  static err<T>(msg: string, ctx?: Context): Result<T> {
    return new Result<T>({ err: msg, ctx });
  }
}
