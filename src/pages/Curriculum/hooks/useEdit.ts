import useBoolState from "@/hooks/useBoolState";
import { useState } from "react";

const useEdit = <T>() => {
  const [visible, openModal, closeModal] = useBoolState();
  const [currentEditIndex, setCurrentEditIndex] = useState(-1);
  const [currentEditValue, setCurrentEditValue] = useState<T>({} as T);

  function pullAt(array: T[], index: number) {
    const clone = [...array];
    clone.splice(index, 1);
    return clone;
  }

  function replace(array: T[], index: number, object: T) {
    const clone = [...array];
    clone.splice(index, 1, object);
    return clone;
  }

  function openEditModal(values: T, index: number) {
    setCurrentEditIndex(index);
    setCurrentEditValue(values);
    openModal();
  }

  function openCreateModal(defaultValue = {} as T) {
    setCurrentEditIndex(-1);
    setCurrentEditValue(defaultValue);
    openModal();
  }

  return {
    visible,
    pullAt,
    replace,
    currentEditIndex,
    currentEditValue,
    openEditModal,
    openCreateModal,
    closeModal,
  };
};

export default useEdit;
