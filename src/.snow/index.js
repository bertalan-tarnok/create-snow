import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync
} from "fs";

import { performance } from "perf_hooks";
import { execSync, exec } from "child_process";

import { createServer } from "http";

import { watch } from "chokidar";

let dev = process.argv[2] === "--dev";

let out = dev ? "dev" : "out";

let jsOutDir = "js";

if (!dev) {
  jsOutDir +=
    "-" +
    Math.floor(Math.random() * 36 ** 6)
      .toString(36)
      .padStart(6, "0");
}

let build = () => {
  let start = performance.now();

  let root = readFileSync("src/root.html").toString();

  if (existsSync(out) && !dev) {
    rmSync(out, { recursive: true });
  }

  mkdirSync(out + "/" + jsOutDir, { recursive: true });

  let compile = (path = "src/pages") => {
    for (let entry of readdirSync(path)) {
      if (statSync(path + "/" + entry).isDirectory()) {
        compile(path + "/" + entry);
        continue;
      }

      if (!entry.endsWith(".ts")) continue;

      let page = root;

      if (entry.match(/.ts$/)) {
        page = page.replace(
          /\[body\]/g,
          `<script src="/${jsOutDir}/${path.replace(/^src\//, "")}/${entry.replace(
            /\.ts$/,
            ".js"
          )}" type="module"></script>`
        );
      }

      let headFileName = entry.replace(/\.ts$/, ".head");
      let headAddition = "";

      if (existsSync(path + "/" + headFileName)) {
        headAddition = readFileSync(path + "/" + headFileName).toString();
      }

      page = page.replace(/\[head\]/g, headAddition);

      let outFilePath = path.replace(/^src\/pages/, "");

      if (!entry.match(/(\\|\/)?index\.ts$/)) {
        let addition = "/" + entry.replace(/\.[^\.]+$/, "");
        outFilePath += addition;
        mkdirSync(out + outFilePath, { recursive: true });
      }

      outFilePath += "/index.html";

      writeFileSync(out + outFilePath, page);
    }
  };

  compile();

  if (existsSync(`${out}/static`)) {
    rmSync(`${out}/static`, { recursive: true });
  }

  mkdirSync(`${out}/static`);

  execSync(`cp static/* ${out}/static -r`);

  console.log(`build - ${(performance.now() - start).toFixed(2)} ms`);
};

let tsc = `npx tsc --outDir ${out}/${jsOutDir}`;

if (dev) {
  tsc += " -w";
  exec(tsc);

  watch(["src", "static"], { ignoreInitial: true }).on("all", () => {
    build();
  });

  build();

  let mime = JSON.parse(readFileSync(".snow/mime.json").toString());

  createServer((req, res) => {
    let path = req.url;
    if (!path.match(/\..+$/)) path += "/index.html";

    if (!existsSync("dev" + path)) {
      res.writeHead(404);
      res.end();
      return;
    }

    res.setHeader("Content-Type", mime[path.match(/(?<=\.).+$/)[0]]);
    res.end(readFileSync("dev" + path));
  }).listen(8080);

  console.log("http://localhost:8080");
} else {
  build();
  execSync(tsc, { stdio: "inherit" });
  console.log("build - ./out");
}
