import fs from "node:fs";
const j = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
j.rewrites = [{ source: "/(.*)", destination: "/index.html" }];
fs.writeFileSync("vercel.json", JSON.stringify(j, null, 2) + "\n");
