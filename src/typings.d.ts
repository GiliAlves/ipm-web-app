/**
 * Shim de tipos para bibliotecas legadas que ainda referenciam `SetIterator`.
 * O tipo foi removido do TypeScript moderno; mapeamos para o iterador padrão.
 */
declare type SetIterator<T> = Iterator<T, undefined, unknown>;
