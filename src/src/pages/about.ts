import { page } from "@lib/page";
import { h } from "@lib/h";

page("about", ["index", "/"]);

let link = h("link");
link.rel = "stylesheet";
link.href = "/static/about.css";

document.head.append(link);
