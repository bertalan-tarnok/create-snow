#!/usr/bin/env node

import { execSync } from "child_process";
import { readdirSync } from "fs";

if (readdirSync("./").length > 0) {
  console.error("Run this command in a non empty directory!");
  process.exit(1);
}

let src =
  import.meta.url
    .replace(/\\/, "/")
    .replace(/index.js$/, "")
    .replace(/file:\/\/\//i, "") + "src";

execSync(`cp -r ${src}/. .`, { stdio: "inherit" });

console.log(
  `
Done!

Next steps:
  npm i
  npm run dev`
);
