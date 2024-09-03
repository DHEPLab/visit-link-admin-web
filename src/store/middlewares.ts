import type { StateCreator, StoreMutatorIdentifier } from "zustand/vanilla";
import { devtools } from "zustand/middleware";

export const middlewares = <T, Mos extends [StoreMutatorIdentifier, unknown][] = []>(
  f: StateCreator<T, [], Mos>,
  name: string,
) => devtools(f, { name });
