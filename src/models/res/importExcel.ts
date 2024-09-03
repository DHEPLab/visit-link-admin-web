export interface ImportExcelCheckRes {
  errData: {
    number: number;
    name: string;
    matters: string;
  }[];
  total: number;
}
