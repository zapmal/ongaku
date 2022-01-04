// https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
export enum PrismaError {
  ValueTooLongForColumnType = 'P2000',
  WhereConditionDoesNotExist = 'P2001',
  UniqueConstraint = 'P2002',
  ForeignKeyConstraint = 'P2003',
  DatabaseConstraint = 'P2004',
  RecordDoesNotExist = 'P2025',
  RequiredRecordDoesNotExist = 'P2025',
}
