import {
  CaptureAndParseStackReturnValue,
  captureAndParseStackTrace,
} from '@quizizz/stacktrace-utils';

/**
 * Base Error class
 *
 * code: number; // http status code, eg 500, 404, 401, 429
 * desc: string; // this is short error code to quickly identify the error class, eg. user.TOO_MANY_REQUESTS
 * details: any; // this goes to sentry or other such service for error tracing
 * data: any; // this is sent to the frontend. This should only be what is required
 * parsedStack: CaptureAndParseStackReturnValue; // stacktrace for error handlers
 **/
export default class BaseError extends Error {
  code: number;
  desc: string;
  details: any;
  data: any;
  parsedStack: CaptureAndParseStackReturnValue;

  constructor(
    msg?: string,
    code?: number,
    desc?: string,
    details?: any,
    data?: any,
  ) {
    super(msg);
    this.code = code;
    this.desc = desc;
    this.details = details;
    this.data = data;
    this.parsedStack = captureAndParseStackTrace({
      startStackFunction: this.constructor,
    });
  }
}
