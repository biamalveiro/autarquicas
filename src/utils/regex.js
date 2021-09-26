export const escapeForRegex = (text) =>
  text.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
export const acronymRegex = (party) =>
  new RegExp(`(?<=-|[.-]|^)${escapeForRegex(party)}(?=-|[.-]|$)`);
