import defaultStorage from "./json_storage.js";
import path from "path";

let storage = defaultStorage;

export async function GiveawayStorage(customPath) {
  if (customPath) {
    try {
      const absolutePath = path.isAbsolute(customPath)
        ? customPath
        : path.resolve(process.cwd(), customPath);
      const module = await import(`file://${absolutePath}`);
      storage = module.default || module;
    } catch {
      storage = defaultStorage;
    }
  } else {
    storage = defaultStorage;
  }
}

export const StorageFunctions = new Proxy(
  {},
  {
    get(_, prop) {
      const currentStorage = storage;
      if (prop in currentStorage) {
        return currentStorage[prop].bind(currentStorage);
      }
      return undefined;
    },
  }
);
