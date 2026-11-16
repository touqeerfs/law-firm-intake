export type RepositoryErrorCode = 'network' | 'not_found' | 'corrupt' | 'storage';

const messages: Record<RepositoryErrorCode, string> = {
  network: 'The server did not respond.',
  not_found: 'This contact does not exist.',
  corrupt: 'Saved data in this browser could not be read.',
  storage: 'This browser refused to save (storage full or disabled).',
};

export class RepositoryError extends Error {
  readonly code: RepositoryErrorCode;

  constructor(code: RepositoryErrorCode) {
    super(messages[code]);
    this.name = 'RepositoryError';
    this.code = code;
  }
}
