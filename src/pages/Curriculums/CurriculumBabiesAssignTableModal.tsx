import AssignModalTable, { AssignModalTableProps } from "@/components/AssignModalTable";
import { usePagination } from "@/hooks/usePagination";
import { useEffect } from "react";

type CurriculumBabiesAssignTableModalProps<T> = AssignModalTableProps<T> & { curriculumId: number };

const CurriculumBabiesAssignTableModal = <T,>({
  curriculumId,
  title,
  columns,
  visible,
  width,
  onCancel,
  onFinish,
}: CurriculumBabiesAssignTableModalProps<T>) => {
  const { loading, dataSource, pagination, onChangeSearch, onChange, resetSearch } = usePagination<T>({
    apiRequestUrl: `/admin/curriculums/${curriculumId}/not_assigned_babies`,
  });

  useEffect(() => {
    resetSearch();
  }, [resetSearch]);

  return (
    <AssignModalTable
      title={title}
      columns={columns}
      visible={visible}
      width={width}
      loading={loading}
      dataSource={dataSource}
      pagination={pagination}
      onChangeSearch={onChangeSearch}
      onChange={onChange}
      onCancel={onCancel}
      onFinish={onFinish}
    />
  );
};

export default CurriculumBabiesAssignTableModal;
