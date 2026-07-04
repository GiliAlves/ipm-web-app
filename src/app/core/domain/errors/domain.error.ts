/**
 * Erro de domínio base para falhas de regras de negócio.
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}
