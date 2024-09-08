export interface CheckError {
  number: number;
  name: string;
  matters: string;
}

export interface ImportExcelCheckRes {
  errData: CheckError[];
  total: number;
}
