import { RecoilState, RecoilValue, Snapshot, useRecoilCallback } from 'recoil'

export type StateSetter = <T>(
  recoilVal: RecoilState<T>,
  valOrUpdater: ((currVal: T) => T) | T
) => void

export type StoreCallbackLoadable<
  Args extends ReadonlyArray<unknown>,
  Return
> = (
  get: <T>(recoilVal: RecoilValue<T>) => T,
  set: StateSetter,
  snapshot: Snapshot
) => (...args: Args) => Return

export const State = {
  useStoreCallback: <Args extends ReadonlyArray<unknown>, Return>(
    fn: StoreCallbackLoadable<Args, Return>,
    deps?: ReadonlyArray<unknown>
  ): ((...args: Args) => Return) => {
    return useRecoilCallback(({ set, snapshot }) => {
      const get = <T>(value: RecoilValue<T>): T =>
        snapshot.getLoadable(value).contents

      return fn(get, set, snapshot)
    }, deps)
  },
}
