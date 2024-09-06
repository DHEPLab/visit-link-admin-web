import { Table, TableProps } from "antd";

const ZebraTable = <T,>(props: TableProps<T>) => {
  return <Table rowClassName={(_record, index) => (index % 2 === 0 ? "even-row" : "odd-row")} {...props} />;
};

export default ZebraTable;
