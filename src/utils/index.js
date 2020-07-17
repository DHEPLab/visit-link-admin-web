import { useState, useEffect } from 'react';
import Axios from 'axios';

export function useFetch(url, params = {}, initialState = {}) {
  const [data, setData] = useState(initialState);

  function load(search = {}) {
    Axios.get(url, {
      params: {
        ...params,
        ...search,
      },
    }).then((r) => setData(r.data));
  }

  useEffect(load, []);
  return [data, load];
}

export function useManualFetch(url, params = {}, initialState = {}) {
  const [data, setData] = useState(initialState);

  function load(search = {}) {
    Axios.get(url, {
      params: {
        ...params,
        ...search,
      },
    }).then((r) => setData(r.data));
  }

  return [data, load];
}

export function fileFormat(file) {
  if (!file.name) return;
  const array = file.name.split('.');
  return array[array.length - 1];
}

export function useBoolState(initialState = false) {
  const [bool, setBool] = useState(initialState);
  const setBoolTrue = () => {
    setBool(true);
  };
  const setBoolFalse = () => {
    setBool(false);
  };
  return [bool, setBoolTrue, setBoolFalse];
}

// return file path without query params
export function cleanQueryParams(path) {
  return path.split('?')[0];
}

const dayOfMonth = 30;
export function filterLessons(lessons, stage, startMonth, endMonth) {
  if (!stage || startMonth == null || startMonth === '' || endMonth == null || endMonth === '')
    return [];
  if (!lessons || lessons.length === 0) return [];
  return lessons.filter((lesson) => {
    return (
      lesson.stage === stage &&
      lesson.startOfApplicableDays >= startMonth * dayOfMonth &&
      lesson.endOfApplicableDays <= endMonth * dayOfMonth
    );
  });
}
