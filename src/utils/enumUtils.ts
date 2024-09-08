export const enumKeysIterator = <T extends object>(enums: T): Array<keyof T> => {
  return Object.keys(enums) as Array<keyof T>;
};
