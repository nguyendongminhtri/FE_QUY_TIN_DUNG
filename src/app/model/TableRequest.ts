export interface TableRequest {
  drawTable: boolean;
  headers: string[];
  rows: string[][];
  merges?: MergeInfo[];
  tableType?: string;
}

export interface MergeInfo {
  rowIndex: number;
  mergeTargets: string[];
  mergedValue: string;
}
