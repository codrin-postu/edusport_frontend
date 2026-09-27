const T = "(^|[\\s\"'`:])";
const E = "(?=[\\s\"'`]|$)";
const FOOTER = "relative w-fit pb-\\[2px\\] after:absolute after:left-0 after:bottom-0 after:h-\\[2px\\] after:w-0 after:bg-mustard after:transition-\\[width\\] after:duration-200 hover:after:w-full";

export default {
  rules: [
    { match: new RegExp(FOOTER, "g"), replace: "link-footer" },
    { match: new RegExp(`${T}(?:link-underline-rust|link-underline-animate|menu-link-underline)${E}`, "g"), replace: "$1link" },
    { match: new RegExp(`${T}hover:text-(?:rust|accent)${E}`, "g"), replace: () => null },
  ],
};
