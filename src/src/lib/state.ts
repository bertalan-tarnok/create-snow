export let state = <T>(initial?: T) => {
  let value = initial;

  let subs: ((v: T) => void)[] = [];

  let set = (v: T) => {
    value = v;

    for (let f of subs) {
      f(v);
    }
  };

  let sub = (f: (v: T) => void) => {
    subs.push(f);
  };

  return { value, set, sub };
};
