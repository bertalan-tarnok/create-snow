import { page } from "../lib/page.js";
import { h } from "../lib/h.js";

page("about", ["index", "/"]);

let link = h("link");
link.rel = "stylesheet";
link.href = "/static/about.css";

document.head.append(link);
