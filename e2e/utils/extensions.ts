import StreamZip from "node-stream-zip";
import { CACHE_PATH } from "./constants";
import path from "path";

export async function extractFile(pathFile) {
  const zip = new StreamZip.async({ file: path.join(__dirname, pathFile) });
  await zip.extract(null, CACHE_PATH);
}

export async function extractExtensionPackage(extensionId) {
  await extractFile(`../extensions/${extensionId}.zip`);
}
