import { useBoolState } from "@/utils";
import React, { useState } from "react";
import lodashPullAt from "lodash.pullat";

export default function withEdit(Wrapper) {
  return function (props) {
    const [visible, openModal, closeModal] = useBoolState();
    const [currentEditIndex, setCurrentEditIndex] = useState(-1);
    const [currentEditValue, setCurrentEditValue] = useState({});

    function pullAt(array, index) {
      const clone = [...array];
      lodashPullAt(clone, [index]);
      return clone;
    }

    function replace(array, index, object) {
      const clone = [...array];
      clone[index] = object;
      return clone;
    }

    function openEditModal(values, index) {
      setCurrentEditIndex(index);
      setCurrentEditValue(values);
      openModal();
    }

    function openCreateModal(defaultValue = {}) {
      setCurrentEditIndex(-1);
      setCurrentEditValue(defaultValue);
      openModal();
    }

    return (
      <Wrapper
        {...props}
        {...{
          visible,
          pullAt,
          replace,
          currentEditIndex,
          currentEditValue,
          openEditModal,
          openCreateModal,
          closeModal,
        }}
      />
    );
  };
}
