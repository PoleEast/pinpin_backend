export class DatabaseException extends Error {
  constructor(
    public readonly message: string,
    public readonly originalError: unknown,
  ) {
    super(message);
    this.name = "DatabaseException";
  }
}
