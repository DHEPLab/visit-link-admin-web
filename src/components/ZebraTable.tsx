import { Table, TableProps } from "antd";
import { AnyObject } from "antd/es/_util/type";

export type ZebraTableProps<T = AnyObject> = TableProps<T>;

const ZebraTable = <T,>(props: TableProps<T>) => {
  return <Table rowClassName={(_record, index) => (index % 2 === 0 ? "even-row" : "odd-row")} {...props} />;
};

export default ZebraTable;
