import { nanoid } from "nanoid";
import { File } from "../models/file.model.js";

async function generateUniqueCode() {
  let code;
  let exists = true;

  while (exists) {
    code = nanoid(8);
    const existing = await File.findOne({ code });
    if (!existing) exists = false;
  }
  let upperCaseCode = code.toLocaleUpperCase()
  return upperCaseCode;
}
export default generateUniqueCode