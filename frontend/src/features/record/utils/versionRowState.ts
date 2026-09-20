export type VersionRowState =
  | { kind: 'current'; isOpen: boolean }
  | { kind: 'past'; isOpen: boolean; isRestoring: boolean };

export function versionStateOf(
  isCurrent: boolean,
  isOpen: boolean,
  isRestoring: boolean,
): VersionRowState {
  if (isCurrent) return { kind: 'current', isOpen };
  return { kind: 'past', isOpen, isRestoring };
}
