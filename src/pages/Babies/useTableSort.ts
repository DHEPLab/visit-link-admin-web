import { useState } from "react";
import type { WithPageProps } from "@/components/WithPage";
import { ZebraTableProps } from "@/components/ZebraTable";

interface useTableSortOptions {
  onChangePage: WithPageProps["onChange"];
  onChangeSearch: WithPageProps["onChangeSearch"];
}

const useTableSort = <T>({ onChangePage, onChangeSearch }: useTableSortOptions) => {
  const [sortField, setSortField] = useState<string | null>(null);

  const sorterFun: ZebraTableProps<T>["onChange"] = (pagination, _filters, sorter) => {
    const { order, field } = Array.isArray(sorter) ? sorter[0] || {} : sorter;
    const newSortField = order ? `${field},${order === "ascend" ? "asc" : "desc"}` : null;
    setSortField(newSortField);
    if (newSortField === sortField) {
      onChangePage(pagination);
    } else {
      onChangeSearch("sort", newSortField);
    }
  };

  return {
    sorterFun,
  };
};

export default useTableSort;
