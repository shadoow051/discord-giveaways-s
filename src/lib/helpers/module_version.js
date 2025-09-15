import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const packagePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../package.json"
);
let Version = "unknown";
try {
  Version = JSON.parse(fs.readFileSync(packagePath, "utf-8")).version;
} catch (err) {
  console.error(err);
}
export { Version };
