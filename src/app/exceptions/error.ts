export const enum HttpStatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

class BaseError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpStatusCode;

  constructor(name: string, httpCode: HttpStatusCode, description: string) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;

    Error.captureStackTrace(this);
  }
}

export class APIError extends BaseError {
  constructor(
    name: string,
    httpCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
    description = 'Internal Server Error',
  ) {
    super(name, httpCode, description);
  }
}

export class NotFoundError extends APIError {
  constructor(description: string) {
    super('NOT_FOUND', HttpStatusCode.NOT_FOUND, description);
  }
}

export class UnAuthorizedError extends APIError {
  constructor(description: string) {
    super('UNAUTHORIZED', HttpStatusCode.UNAUTHORIZED, description);
  }
}

export class ForbiddenError extends APIError {
  constructor(description: string) {
    super('FORBIDDEN', HttpStatusCode.FORBIDDEN, description);
  }
}

export class BadRequestError extends APIError {
  constructor(description: string) {
    super('BAD_REQUEST', HttpStatusCode.BAD_REQUEST, description);
  }
}

export class ConflictError extends APIError {
  constructor(description: string) {
    super('CONFLICT', HttpStatusCode.CONFLICT, description);
  }
}

export interface PostgresErrorInterface {
  code: string,
  detail: string
}

//general db error
// https://www.postgresql.org/docs/9.2/errcodes-appendix.html
export class GeneralPostgresError extends APIError {
  constructor(err: PostgresErrorInterface) {
    if(err.code === '23503') {
      throw new NotFoundError(err.detail);
    } else if (err.code === '23505') {
      throw new ConflictError(err.detail);
    } else {
      super('UNHANDLED_POSTGRES_ERROR');
    }
  }
}

