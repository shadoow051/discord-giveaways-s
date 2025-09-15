import crypto from "crypto";
export function GenerateID({
  prefix = "",
  infix = "",
  suffix = "",
  length = 15,
} = {}) {
  if (infix) {
    return `${prefix}${infix}${suffix}`;
  }

  const randomBytes = crypto.randomBytes(Math.ceil(length / 2)).toString("hex");
  const randomPart = randomBytes.slice(0, length);

  return `${prefix}${randomPart}${suffix}`;
}
