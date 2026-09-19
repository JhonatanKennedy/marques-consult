/**
 * Raised when an operation names a version number the record does not hold.
 *
 * Distinct from `ItemNotFoundError` because the two describe different
 * disappearances: an item is gone from the list, a version is gone from the
 * record. The client says different things about each.
 */
export class VersionNotFoundError extends Error {
  readonly versionNumber: number;

  constructor(versionNumber: number) {
    super(`Version ${versionNumber} is not in the record`);
    this.name = 'VersionNotFoundError';
    this.versionNumber = versionNumber;
  }
}
