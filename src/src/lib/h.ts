type H = <T extends keyof HTMLElementTagNameMap>(
  tagn: T,
  inside?: Element | Element[] | string | (Element | string)[]
) => HTMLElementTagNameMap[T];

export let h: H = (tagn, inside) => {
  let el = document.createElement(tagn);

  if (!inside) return el;

  if (typeof inside === "string") {
    el.textContent = inside;
  } else if (!Array.isArray(inside)) {
    el.append(inside);
  } else {
    for (let child of inside || []) {
      if (typeof child === "string") {
        el.textContent += child;
      } else {
        el.append(child);
      }
    }
  }

  return el;
};
