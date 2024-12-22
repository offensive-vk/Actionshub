import { mkdirSync, writeFileSync } from "fs";

export const OUTPUT_FOLDER = "./user-3d-svg";

export const writeFile = (fileName: string, content: string): void => {
  mkdirSync(OUTPUT_FOLDER, { recursive: true });
  writeFileSync(`${OUTPUT_FOLDER}/${fileName}`, content);
};
