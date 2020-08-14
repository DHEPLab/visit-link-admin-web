import { useMethods } from './BabyModalForm';

it('should disable invalid edc date', () => {
  const { disabledDateForEDC } = useMethods();
  const baseline = new Date(2020, 1, 4);
  expect(disabledDateForEDC(new Date(2020, 1, 5), baseline)).toBeFalsy();
  expect(disabledDateForEDC(new Date(2020, 1, 3), baseline)).toBeTruthy();
  expect(disabledDateForEDC(new Date(2020, 10, 10), baseline)).toBeFalsy();
  expect(disabledDateForEDC(new Date(2020, 10, 11), baseline)).toBeTruthy();
});
