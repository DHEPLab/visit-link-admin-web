import { Space, Table, TableProps, Tag } from "antd";

const meta = {
  title: "Design System/Table",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

export const BasicTableComponent = () => {
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (_value, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_value, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const dataSource: DataType[] = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
      tags: ["loser"],
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
      tags: ["cool", "teacher"],
    },
    {
      key: "4",
      name: "Tonny Brown",
      age: 22,
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
    {
      key: "5",
      name: "Jim Green",
      age: 42,
      address: "London No. 2 Lake Park",
      tags: ["loser"],
    },
    {
      key: "6",
      name: "Joe Black",
      age: 52,
      address: "Sydney No. 1 Lake Park",
      tags: ["teacher"],
    },
  ];

  return <Table dataSource={dataSource} columns={columns} />;
};
