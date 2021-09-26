const escapeForRegex = (text) => text.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

const acronymRegex = (party) =>
  new RegExp(`(?<=-|[.-]|^)${escapeForRegex(party)}(?=-|[.-]|$)`);

const coalitionPartiesRegex = new RegExp(
  /(?<=^|\.|\/|-)(B.E.)|(CDS-PP)|([a-zA-Z]|\/)+(?=\.|\/|-|$)/g
);

module.exports = {
  escapeForRegex,
  acronymRegex,
  coalitionPartiesRegex,
};
