import { Injectable } from '@angular/core';
import {
  FieldPath,
  Firestore,
  OrderByDirection,
  WhereFilterOp,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  limit,
  orderBy,
  query,
  where
} from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
/**
 * Serviço genérico de acesso ao Firestore.
 *
 * Centraliza consultas simples a coleções, ordenações, filtros e documentos únicos.
 * As propriedades `path`, `fieldPath` e `orderByDirection` devem ser configuradas
 * pelos consumidores antes de cada chamada.
 */
export class FirebaseService {

  /** Nome do campo usado para ordenação da consulta. */
  public fieldPath!: string;
  /** Direção da ordenação (`asc` ou `desc`). */
  public orderByDirection!: OrderByDirection;
  /** Nome da coleção do Firestore que será consultada. */
  public path!: string;

  constructor(private readonly firestore: Firestore) { }

  /**
   * Retorna todos os documentos da coleção configurada em `path`, ordenados.
   * @returns Observable com a lista de documentos.
   */
  getAll = () =>
    collectionData(query(collection(this.firestore, this.path), orderBy(this.fieldPath, this.orderByDirection)), { idField: 'id' });

  /**
   * Retorna uma quantidade limitada de documentos da coleção configurada.
   * @param value - Número máximo de documentos a retornar.
   * @returns Observable com a lista limitada de documentos.
   */
  getLimit = (value: number) =>
    collectionData(query(collection(this.firestore, this.path), orderBy(this.fieldPath, this.orderByDirection), limit(value)), { idField: 'id' })

  /**
   * Retorna documentos da coleção filtrados por um campo, operador e valor.
   * @param fieldPath - Campo a ser filtrado.
   * @param opStr - Operador de comparação do Firestore.
   * @param value - Valor a ser comparado.
   * @returns Observable com a lista filtrada de documentos.
   */
  getWhere = (fieldPath: string | FieldPath, opStr: WhereFilterOp, value: unknown) =>
    collectionData(query(collection(this.firestore, this.path), orderBy(this.fieldPath, this.orderByDirection), where(fieldPath, opStr, value)), { idField: 'id' })

  /**
   * Retorna um único documento pelo ID.
   * @param id - Identificador do documento.
   * @returns Observable com o documento.
   */
  get = (id: string) =>
    docData(doc(this.firestore, `${this.path}/${id}`), { idField: 'id' });

  /**
   * Cria um novo documento na coleção `biblia`.
   * @param biblia - Dados do documento a ser criado.
   * @returns Promise com a referência do documento criado.
   */
  create = (biblia: unknown) =>
    addDoc(collection(this.firestore, '/biblia'), biblia as Record<string, unknown>);
}
