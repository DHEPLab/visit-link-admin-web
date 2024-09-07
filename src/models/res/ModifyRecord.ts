export type ModifyRecordsResponse = ModifyRecord[];

export interface ModifyRecord {
  userName: string;
  roleName: string;
  columnName: string[];
  oldValue: string[];
  newValue: string[];
  lastModifiedAt: string;
}
