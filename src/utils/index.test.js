import Axios from 'axios';
import * as utils from './index';
import { wait } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';

jest.mock('axios');

it('should fetch resource', async () => {
  Axios.get.mockResolvedValue({
    data: 2,
  });
  const { result } = renderHook(() => utils.useFetch('/api/fake'));
  await act(async () => {
    await wait();
    const [data] = result.current;
    expect(data).toBe(2);
  });
});

it('should manual fetch resource', async () => {
  Axios.get.mockResolvedValue({
    data: 3,
  });
  const { result } = renderHook(() => utils.useManualFetch('/api/fake'));
  const [_, load] = result.current;
  load();
  await act(async () => {
    await wait();
    const [data] = result.current;
    expect(data).toBe(3);
  });
});

it('should use bool state', async () => {
  const { result } = renderHook(() => utils.useBoolState());
  const [_, setTrue, setFalse] = result.current;
  act(() => {
    setTrue();
  });
  expect(result.current[0]).toBeTruthy();
  act(() => {
    setFalse();
  });
  expect(result.current[0]).toBeFalsy();
});
