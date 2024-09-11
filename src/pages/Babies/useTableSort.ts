import { usePaginationResult } from "@/hooks/usePagination";
import { useState } from "react";
import { ZebraTableProps } from "@/components/ZebraTable";

interface useTableSortOptions<T> {
  onChangePage: usePaginationResult<T>["onChange"];
  onChangeSearch: usePaginationResult<T>["onChangeSearch"];
}

const useTableSort = <T>({ onChangePage, onChangeSearch }: useTableSortOptions<T>) => {
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
