import { h } from "./h";

export let page = (title: string, link: [string, string]) => {
  let h1 = h("h1", title);

  let a = h("a", link[0]);
  a.href = link[1];

  document.body.append(h1, a);
};
