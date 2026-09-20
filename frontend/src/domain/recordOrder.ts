import type { ListVersion } from './list';

export function appendVersion(
  history: ListVersion[],
  version: ListVersion,
): ListVersion[] {
  const withoutDuplicate = history.filter(
    (entry) => entry.number !== version.number,
  );
  return [version, ...withoutDuplicate];
}

export function truncateHistory(
  history: ListVersion[],
  version: ListVersion,
): ListVersion[] {
  const survivors = history.filter((entry) => entry.number < version.number);
  return [version, ...survivors];
}
