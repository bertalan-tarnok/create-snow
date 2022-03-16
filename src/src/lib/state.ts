type SubFn<T> = (v: T) => void;

export let state = <T>(initial?: T) => {
  let value = initial;

  let subs: SubFn<T>[] = [];

  let set = (v: T) => {
    value = v;

    for (let f of subs) {
      f(v);
    }
  };

  let sub = (f: SubFn<T>) => {
    subs.push(f);
  };

  return { value, set, sub };
};
