export class NetworkError extends Error {
  readonly path: string;

  constructor(path: string) {
    super(`Network failure on ${path}`);
    this.name = 'NetworkError';
    this.path = path;
  }
}

export class ApiError extends Error {
  readonly status: number;
  readonly path: string;

  constructor(status: number, path: string) {
    super(`API ${status} on ${path}`);
    this.name = 'ApiError';
    this.status = status;
    this.path = path;
  }
}
