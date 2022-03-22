#!/usr/bin/env node

import { cpSync, readdirSync } from "fs";

if (readdirSync("./").length > 0) {
  console.error("Run this command in an empty directory!");
  process.exit(1);
}

let src =
  import.meta.url
    .replace(/\\/, "/")
    .replace(/index.js$/, "")
    .replace(/file:\/\/\//i, "") + "src";

cpSync(src, ".", { recursive: true });

console.log(
  `
Done!

Next steps:
  npm i
  npm run dev`
);
